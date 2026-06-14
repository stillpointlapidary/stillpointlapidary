/* ── Supabase Client + Auth (from lines 6291–6735) ── */
const _supa = window.supabase.createClient(
  'https://vxujlgyhgnihnqrxzefw.supabase.co',
  'sb_publishable_LfVL1UL-_8_8hXQktiF1BQ_UgbWvAPb',
  {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

// ── Stone intention reasons (per-stone Why text) ──
let stoneIntentionReasonsMap = {};
async function loadStoneIntentionReasons(){
  try{
    const {data,error}=await _supa.from('stone_intention_reasons')
      .select('stone_slug,intention_slug,reason_text,display_order')
      .eq('is_active',true)
      .eq('reason_type','curated')
      .order('display_order',{ascending:true});
    if(error)throw error;
    (data||[]).forEach(row=>{
      if(!row.stone_slug||!row.intention_slug||!row.reason_text)return;
      if(!stoneIntentionReasonsMap[row.stone_slug])stoneIntentionReasonsMap[row.stone_slug]={};
      stoneIntentionReasonsMap[row.stone_slug][row.intention_slug]=row.reason_text;
      if(!curatedIntentionIndex[row.intention_slug])curatedIntentionIndex[row.intention_slug]=[];
      curatedIntentionIndex[row.intention_slug].push({stone_slug:row.stone_slug,reason_text:row.reason_text,display_order:row.display_order});
    });
  }catch(e){
    console.warn('Could not load stone intention reasons:',e);
  }
}

// ── Load stones from Supabase, then init app ──
function runPageAction(action, attempt){
  if(!action)return;
  const n=attempt||0;
  let handled=false;
  if(action==='guide'){
    handled=!!document.getElementById('popup-instructions');
    if(handled)openPopup('instructions');
  }else if(action==='manage'){
    handled=!!document.getElementById('popup-manage');
    if(handled)openPopup('manage');
  }else if(action==='add-entry'){
    handled=!!document.getElementById('add-enc-form-overlay');
    if(handled)openAddEncForm();
  }else if(action==='request-entry'){
    handled=!!document.getElementById('entry-request-form-overlay');
    if(handled)openEntryRequestForm();
  }
  if(!handled&&n<5)setTimeout(()=>runPageAction(action,n+1),120);
}

loadStonesAndInit().then(()=>{
  const params=new URLSearchParams(window.location.search);
  const action=params.get('action');
  const tabParam=params.get('tab');
  const stoneParam=params.get('stone') || (function(){
    try{return sessionStorage.getItem('spl_pending_stone') || '';}catch(e){return '';}
  })();
  const stoneNameParam=params.get('stoneName') || (function(){
    try{return sessionStorage.getItem('spl_pending_stone_name') || '';}catch(e){return '';}
  })();
  const tierParam=params.get('tier');
  const collectionView=params.get('view');
  if(!stoneParam&&tabParam&&['mood','encyclopedia','identify','collection','101'].includes(tabParam)){
    switchTabByName(tabParam);
    if(tabParam==='collection'&&collectionView==='wishlist'){setCollQuickFilter('wish');setWishlistNavActive();}
    // Re-apply after auth+data loading settles (auth callbacks can fire and re-render after init)
    setTimeout(()=>{
      switchTabByName(tabParam);
      if(tabParam==='collection'&&collectionView==='wishlist'){setCollQuickFilter('wish');setWishlistNavActive();}
    }, 600);
  }
  if(stoneParam){
    try{sessionStorage.removeItem('spl_pending_stone');}catch(e){}
    try{sessionStorage.removeItem('spl_pending_stone_name');}catch(e){}
    if(params.get('from')==='sotd')detailReturnContext={type:'sotd'};
    queueDirectStoneOpen(stoneParam,stoneNameParam);
  }else if(tabParam==='encyclopedia'&&tierParam){
    switchTabByName('encyclopedia');
    setTimeout(()=>encBrowseTier(tierParam),120);
  }else if(params.get('fam')){
    switchTabByName('encyclopedia');
    setTimeout(()=>jumpToFamily(params.get('fam')),120);
  }
  runPageAction(action);
  setTimeout(()=>runPageAction(action), 650);
});

try{ ['lap_coll','lap_owned','lap_wish'].forEach(k=>localStorage.removeItem(k)); }catch(e){}

function _renderAuth(user) {
  const el = document.getElementById('topbar-auth');
  const manageBtn = document.getElementById('manage-btn');
  if(manageBtn) manageBtn.style.display = user ? '' : 'none';
  updateAdminEntryButtons();
  if (!el) return;
  if (user) {
    const name = user.email ? user.email.split('@')[0] : 'Account';
    el.innerHTML = '<span class="auth-user-name" title="'+user.email+'">'+name+'</span> <button class="auth-sign-out" onclick="_signOut()">Sign out</button>';
  } else {
    el.innerHTML = '<button class="btn btn-sm" onclick="_openAuth()">Sign in</button>';
  }
  if(currentCrystal)updateDrawerStatus(currentCrystal.i);
}

async function _authInit() {
  const { data: { session } } = await _supa.auth.getSession();
  _currentUser = session?.user ?? null;
  _renderAuth(_currentUser);
  if (_currentUser) {
    await loadSupabaseState();
    await handlePendingDrawerActionAfterSignIn();
  } else {
    promptPendingDrawerActionIfNeeded();
  }
  _supa.auth.onAuthStateChange(async function(_e, session) {
    const wasLoggedOut = !_currentUser;
    _currentUser = session?.user ?? null;
    _renderAuth(_currentUser);
    if (_currentUser && wasLoggedOut) {
      await loadSupabaseState();
      await handlePendingDrawerActionAfterSignIn();
    } else if(!_currentUser) {
      promptPendingDrawerActionIfNeeded();
      updateDesktopSotdAuth();updateMobileSotdAuth();
    }
    if (_currentUser && window._pendingColl) {
      window._pendingColl = false;
      var t = document.querySelectorAll('.nav-tab')[4];
      if (t) switchTab('collection', t);
    }
  });
}

function promptPendingDrawerActionIfNeeded(){
  const pending=readPendingDrawerAction();
  if(!pending||!pending.action||!pending.stoneId||_currentUser)return;
  if(!document.getElementById('auth-modal-overlay'))return;
  const onHomepage=!document.getElementById('tab-encyclopedia');
  if(!onHomepage){
    const drawerOpen=document.getElementById('detail-drawer')?.classList.contains('open');
    if(!drawerOpen)openDetailWhenReady(pending.stoneId);
  }
  setTimeout(()=>_openAuth(pendingDrawerAuthReason(pending.action)),120);
}

async function handlePendingDrawerActionAfterSignIn(){
  const pending=readPendingDrawerAction();
  if(!pending||!pending.action||!pending.stoneId||!_currentUser)return;
  clearPendingDrawerAction();
  if(document.getElementById('auth-modal-overlay'))closeAuthModal();
  const onHomepage=!document.getElementById('tab-encyclopedia');
  if(pending.action==='add_to_wishlist'){
    try{
      if(!wish[pending.stoneId]){
        await _supa.from('wishlist_items').insert({user_id:_currentUser.id,stone_id:pending.stoneId});
        wish[pending.stoneId]=true;
        localStorage.setItem('lap_wish',JSON.stringify(wish));
      }
      await loadSupabaseState();
      if(onHomepage){
        updateDesktopSotdAuth();updateMobileSotdAuth();
      }else{
        openDetailWhenReady(pending.stoneId);
        setTimeout(()=>updateDrawerStatus(pending.stoneId),180);
      }
    }catch(err){
      console.warn('Could not resume wishlist save after sign-in',err);
    }
  }else if(pending.action==='add_to_collection'){
    setTimeout(()=>{
      if(onHomepage){
        addPieceReturnContext={type:'sotd',stoneId:pending.stoneId};
        openAddForm(pending.stoneId);
      }else{
        const stone=CRYSTALS.find(c=>c.i===pending.stoneId);
        if(stone){currentCrystal=stone;addFromDetail();}
        else{openAddForm(pending.stoneId);}
      }
    },180);
  }
}

function _openAuth(reason) {
  var title = document.getElementById('auth-modal-title');
  var sub = document.getElementById('auth-modal-sub');
  var msg = document.getElementById('auth-msg');
  var inp = document.getElementById('auth-email-input');
  var btn = document.getElementById('auth-submit-btn');
  if(!title||!sub||!msg||!inp||!btn){console.error('Auth modal elements missing');return;}
  if (reason === 'save-collection') {
    title.textContent = 'Sign in to save this stone';
    sub.textContent = 'Sign in to save this stone to your collection.';
  } else if (reason === 'save-wishlist') {
    title.textContent = 'Sign in to save this stone';
    sub.textContent = 'Sign in to add this stone to your wishlist.';
  } else if (reason === 'collection') {
    title.textContent = 'Sign in to use My Collection';
    sub.textContent = 'Your collection saves securely to your account and follows you across devices.';
  } else {
    title.textContent = 'Sign in to your collection';
    sub.textContent = "Enter your email and we'll send you a magic link — no password needed.";
  }
  msg.textContent = '';
  msg.style.color = '#8b7355';
  inp.value = '';
  btn.disabled = false;
  btn.textContent = 'Send magic link';
  document.getElementById('auth-modal-overlay').classList.add('open');
  setTimeout(function(){ inp.focus(); }, 80);
}

function closeAuthModal() {
  document.getElementById('auth-modal-overlay').classList.remove('open');
}

async function submitMagicLink() {
  var inp = document.getElementById('auth-email-input');
  var btn = document.getElementById('auth-submit-btn');
  var msg = document.getElementById('auth-msg');
  var email = (inp.value || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.style.color = '#c0392b';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending…';
  msg.textContent = '';
  var result = await _supa.auth.signInWithOtp({
    email: email,
    options: { emailRedirectTo: window.location.href }
  });
  if (result.error) {
    msg.textContent = result.error.message || 'Something went wrong. Please try again.';
    msg.style.color = '#c0392b';
    btn.disabled = false;
    btn.textContent = 'Send magic link';
  } else {
    msg.textContent = '✓ Check your email — link sent! Open it on this device.';
    msg.style.color = '#8b7355';
    btn.textContent = 'Link sent';
  }
}

async function _signOut() {
  await _supa.auth.signOut();
  _currentUser = null;
  collection=[]; owned={}; wish={};
  try{ ['lap_coll','lap_owned','lap_wish'].forEach(k=>localStorage.removeItem(k)); }catch(e){}
  _renderAuth(null);
  encRender();
}

// ── SUPABASE COLLECTION WRITE LAYER ──────────────────────────

// Load collection/wishlist state from Supabase when user logs in
function _priceToNumber(raw){
  const cleaned=String(raw||'').replace(/[^0-9.-]/g,'');
  if(!cleaned)return null;
  const n=Number(cleaned);
  return Number.isFinite(n)?n:null;
}
function _safeFileName(file,idx){
  const original=(file&&file.name?file.name:'photo-'+(idx+1)+'.jpg').toLowerCase();
  const clean=original.replace(/[^a-z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  return clean || ('photo-'+(idx+1)+'.jpg');
}
async function _signedPhotoUrl(storagePath){
  if(!storagePath)return '';
  const { data, error } = await _supa.storage.from('collection-photos').createSignedUrl(storagePath, 60*60);
  if(error){ console.warn('Signed URL failed', error); return ''; }
  return data?.signedUrl || '';
}
async function _getSignedUrls(photoRows){
  const rows=(photoRows||[]).slice().sort((a,b)=>(a.display_order||0)-(b.display_order||0));
  const out=[];
  for(const row of rows){
    const url=await _signedPhotoUrl(row.storage_path);
    if(url)out.push({id:row.id,storage_path:row.storage_path,display_order:row.display_order,url});
  }
  return out;
}
function _rowToCollectionPiece(row,photos){
  return {
    id:row.id,
    crystalId:row.stone_id,
    isCombo:!!row.is_combo,
    comboCrystals:row.combo_stone_ids||[],
    comboCrystalNames:row.combo_stone_names||[],
    nickname:row.nickname||'',
    form:row.form_type||'',
    size:row.size||'',
    dims:'',
    treated:row.treatment||'',
    condition:row.condition||'',
    locCustom:row.location||'',
    shelf:'',tier:'',pos:'',
    acquired:row.acquired_date||'',
    source:row.acquired_from||'',
    price:row.price_paid==null?'':String(row.price_paid),
    notes:row.notes||'',
    photos:photos||[],
    _dbRow:row
  };
}
async function loadSupabaseState() {
  if (!_currentUser) return;

  const activeTab=document.querySelector('main>section[style*="block"]')?.id || '';
  const wrap=document.getElementById('coll-wrap');
  if(activeTab==='tab-collection' && wrap){
    wrap.innerHTML='<div class="empty-coll" style="opacity:0.5;font-size:12px">Syncing…</div>';
  }

  wish = {};
  owned = {};
  collection = [];

  const { data: wData, error: wErr } = await _supa
    .from('wishlist_items')
    .select('stone_id, notes')
    .eq('user_id', _currentUser.id);
  if (wErr) console.warn('Wishlist load failed', wErr);
  if (wData) wData.forEach(r => { wish[r.stone_id] = true; });

  const { data: cData, error: cErr } = await _supa
    .from('collection_items')
    .select('id,user_id,stone_id,form_type,size,notes,acquired_from,acquired_date,price_paid,created_at,updated_at,nickname,treatment,condition,location,is_combo,combo_stone_ids,combo_stone_names')
    .eq('user_id', _currentUser.id)
    .order('created_at',{ascending:false});
  if (cErr) {
    console.error('Collection load failed', cErr);
    alert('Collection could not load: '+cErr.message);
    return;
  }

  const ids=(cData||[]).map(r=>r.id);
  let photosByItem={};
  if(ids.length){
    const { data:pData, error:pErr } = await _supa
      .from('collection_photos')
      .select('id,collection_item_id,storage_path,display_order')
      .eq('user_id', _currentUser.id)
      .in('collection_item_id', ids)
      .order('display_order',{ascending:true});
    if (pErr) console.warn('Photo rows load failed', pErr);
    (pData||[]).forEach(p=>{
      if(!photosByItem[p.collection_item_id])photosByItem[p.collection_item_id]=[];
      photosByItem[p.collection_item_id].push(p);
    });
  }

  const pieceResults = await Promise.all(
    (cData||[]).map(async row => {
      owned[row.stone_id] = true;
      const urls = await _getSignedUrls(photosByItem[row.id]||[]);
      return _rowToCollectionPiece(row, urls);
    })
  );
  pieceResults.forEach(p => collection.push(p));

  localStorage.setItem('lap_owned', JSON.stringify(owned));
  localStorage.setItem('lap_wish', JSON.stringify(wish));
  encRender();
  renderCollection();
  const syncEl=document.getElementById('coll-sync-status');
  if(syncEl){const t=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});syncEl.textContent='Synced at '+t;syncEl.style.display='block';}
  showCollSyncToast('Saved');
  // Re-apply URL tab param — auth+data load can fire after initial tab switch
  const _urlTab=(()=>{try{return new URLSearchParams(window.location.search).get('tab');}catch(e){return null;}})();
  if(_urlTab&&['mood','identify','collection','101'].includes(_urlTab)){switchTabByName(_urlTab);}
  updateDesktopSotdAuth();updateMobileSotdAuth();
}

async function _uploadCollectionPhotos(collectionItemId,photos,startOrder){
  const uploaded=[];
  const items=(photos||[]).slice(0,3);
  const base=Number.isFinite(Number(startOrder))?Number(startOrder):1;
  for(let i=0;i<items.length;i++){
    const item=items[i];
    const file=item.file || item;
    if(!(file instanceof File))continue;
    const path=`${_currentUser.id}/${collectionItemId}/${Date.now()}-${i+1}-${_safeFileName(file,i)}`;
    const { error: upErr } = await _supa.storage
      .from('collection-photos')
      .upload(path, file, { cacheControl:'3600', upsert:false, contentType:file.type || 'image/jpeg' });
    if(upErr) throw upErr;
    const { data:photoRow, error: rowErr } = await _supa.from('collection_photos').insert({
      collection_item_id: collectionItemId,
      user_id: _currentUser.id,
      storage_path: path,
      display_order: base+i
    }).select('id,storage_path,display_order').single();
    if(rowErr) throw rowErr;
    uploaded.push({...photoRow,_pendingId:item._pendingId||null});
  }
  return uploaded;
}
async function _applyPrimaryPhotoOrder(collectionItemId,photoRows,primaryKey){
  const rows=(photoRows||[]).filter(r=>r&&r.id);
  if(!rows.length)return;
  const sorted=rows.slice().sort((a,b)=>{
    const ka=photoKey(a,'existing',0), kb=photoKey(b,'existing',0);
    if(primaryKey&&ka===primaryKey)return-1;
    if(primaryKey&&kb===primaryKey)return 1;
    return (a.display_order||0)-(b.display_order||0);
  });
  for(let i=0;i<sorted.length;i++){
    const { error } = await _supa.from('collection_photos')
      .update({display_order:i+1})
      .eq('user_id',_currentUser.id)
      .eq('collection_item_id',collectionItemId)
      .eq('id',sorted[i].id);
    if(error)throw error;
  }
}


function _isBlankCollectionPieceForUpgrade(p,stoneId){
  if(!p||!stoneId||p.crystalId!==stoneId)return false;
  const hasPhotos=Array.isArray(p.photos)&&p.photos.length>0;
  const meaningful=[p.nickname,p.form,p.size,p.treated,p.condition,p.locCustom,p.shelf,p.tier,p.pos,p.acquired,p.source,p.price,p.notes].some(v=>String(v||'').trim());
  const hasCombo=!!p.isCombo || ((p.comboCrystals||[]).length>0) || ((p.comboCrystalNames||[]).length>0);
  return !hasPhotos&&!meaningful&&!hasCombo;
}
function _findBlankCollectionPieceIndex(stoneId){
  if(!stoneId)return -1;
  return collection.findIndex(p=>_isBlankCollectionPieceForUpgrade(p,stoneId));
}
function _switchToCollectionAndMaybeOpen(pieceId){
  switchTabByName('collection');
  scrollPageTop();
  setTimeout(()=>{
    renderCollection();
    if(pieceId!==null&&pieceId!==undefined){
      const idx=collection.findIndex(p=>String(p.id)===String(pieceId));
      if(idx>=0)openCollDetail(idx);
    }
  },0);
}


window.savePiece = async function(){
  if(!_currentUser){ _openAuth('collection'); return; }
  const crystalId=document.getElementById('f-crystal-val')?.value||'';
  if(!crystalId){ alert('Please select a primary crystal.'); return; }

  const isCombo=document.getElementById('f-combo')?.checked||false;
  const comboIdsRaw=isCombo?Array.from(document.querySelectorAll('.csel')).map(s=>s.value).filter(Boolean):[];
  const comboIds=[...new Set(comboIdsRaw)].filter(id=>id!==crystalId).slice(0,3);
  const comboNames=comboIds.map(id=>CRYSTALS.find(c=>c.i===id)?.n||'').filter(Boolean);

  const payload={
    user_id:_currentUser.id,
    stone_id:crystalId,
    form_type:document.getElementById('f-form')?.value||null,
    size:document.getElementById('f-size')?.value||null,
    notes:document.getElementById('f-notes')?.value?.trim()||null,
    acquired_from:document.getElementById('f-source')?.value?.trim()||null,
    acquired_date:document.getElementById('f-acquired')?.value||null,
    price_paid:_priceToNumber(document.getElementById('f-price')?.value),
    nickname:document.getElementById('f-nick')?.value?.trim()||null,
    treatment:document.getElementById('f-treated')?.value||null,
    condition:document.getElementById('f-condition')?.value||null,
    location:document.getElementById('f-loc-custom')?.value?.trim()||null,
    is_combo:isCombo && comboIds.length>0,
    combo_stone_ids:comboIds,
    combo_stone_names:comboNames
  };

  const saveBtn=document.querySelector('#add-form-overlay .form-footer .btn-accent');
  const oldText=saveBtn?saveBtn.textContent:'';
  if(saveBtn){ saveBtn.disabled=true; saveBtn.textContent='Saving…'; }
  let savedPieceId=null;
  try{
    let editingPiece=(editingCollectionIndex!==null)?collection[editingCollectionIndex]:null;

    // If the user reached this form from an encyclopedia entry after toggling/adding the stone,
    // upgrade the blank placeholder row instead of creating a second minimal record.
    if(!editingPiece && addPieceReturnContext && addPieceReturnContext.type==='encyclopedia'){
      const blankIdx=_findBlankCollectionPieceIndex(crystalId);
      if(blankIdx>=0){
        editingCollectionIndex=blankIdx;
        editingPiece=collection[blankIdx];
      }
    }

    if(editingPiece&&editingPiece.id){
      savedPieceId=editingPiece.id;
      const { error } = await _supa
        .from('collection_items')
        .update(payload)
        .eq('user_id', _currentUser.id)
        .eq('id', editingPiece.id);
      if(error)throw error;
      const existingPhotos=(editingPiece.photos||[]).slice(0,3);
      const remaining=Math.max(0,3-existingPhotos.length);
      let uploadedRows=[];
      if(pendingPhotos.length&&remaining>0){
        uploadedRows=await _uploadCollectionPhotos(editingPiece.id,pendingPhotos.slice(0,remaining),existingPhotos.length+1);
      }
      const allPhotoRows=[...existingPhotos,...uploadedRows];
      let primaryKey=editPrimaryPhotoKey;
      const pendingPrimary=uploadedRows.find(r=>r._pendingId&&r._pendingId===editPrimaryPhotoKey);
      if(pendingPrimary)primaryKey=photoKey(pendingPrimary,'existing',0);
      if(primaryKey){ await _applyPrimaryPhotoOrder(editingPiece.id,allPhotoRows,primaryKey); }
    }else{
      const { data, error } = await _supa
        .from('collection_items')
        .insert(payload)
        .select('id')
        .single();
      if(error)throw error;
      savedPieceId=data.id;
      let uploadedRows=[];
      if(pendingPhotos.length){ uploadedRows=await _uploadCollectionPhotos(data.id,pendingPhotos,1); }
      let primaryKey=editPrimaryPhotoKey;
      const pendingPrimary=uploadedRows.find(r=>r._pendingId&&r._pendingId===editPrimaryPhotoKey);
      if(pendingPrimary)primaryKey=photoKey(pendingPrimary,'existing',0);
      if(primaryKey){ await _applyPrimaryPhotoOrder(data.id,uploadedRows,primaryKey); }
    }
    closeAddForm();
    addPieceReturnContext=null;
    await loadSupabaseState();
    updateLastSaved();
    _switchToCollectionAndMaybeOpen(savedPieceId);
  }catch(err){
    console.error('Save piece failed', err);
    alert('Could not save piece: '+(err.message||err));
  }finally{
    if(saveBtn){ saveBtn.disabled=false; saveBtn.textContent=oldText||'Save piece'; }
  }
};

window.toggleOwned = async function() {
  if (!currentCrystal) return;
  const stoneId = currentCrystal.i;
  if (!_currentUser) { _openAuth('collection'); return; }
  const isOwned = !!owned[stoneId];
  if (isOwned) {
    await _supa.from('collection_items').delete().eq('user_id', _currentUser.id).eq('stone_id', stoneId);
  } else {
    await _supa.from('collection_items').insert({ user_id: _currentUser.id, stone_id: stoneId });
  }
  await loadSupabaseState();
  updateDrawerStatus(stoneId);
  encRender();
};

window.toggleWish = async function() {
  if (!currentCrystal) return;
  const stoneId = currentCrystal.i;
  if (!_currentUser) { _openAuth('collection'); return; }
  const isWished = !!wish[stoneId];
  if (isWished) {
    await _supa.from('wishlist_items').delete().eq('user_id', _currentUser.id).eq('stone_id', stoneId);
    delete wish[stoneId];
  } else {
    await _supa.from('wishlist_items').insert({ user_id: _currentUser.id, stone_id: stoneId });
    wish[stoneId] = true;
  }
  localStorage.setItem('lap_wish', JSON.stringify(wish));
  updateDrawerStatus(stoneId);
  renderCollection();
  encRender();
};

_authInit();

/* ── Nav / Click Hardening (from lines 6737–6878) ── */
/* ── PRE-PASS REPAIR 5: targeted navigation + click hardening ── */
(function(){
  function safeScrollTo(el, offset){
    if(!el)return;
    const y = el.getBoundingClientRect().top + window.scrollY - (offset || 128);
    try{ window.scrollTo({top:Math.max(0,y), left:0, behavior:'smooth'}); }
    catch(e){ window.scrollTo(0, Math.max(0,y)); }
  }
  function encSearchEl(){ return document.getElementById('enc-search') || document.getElementById('enc-count') || document.getElementById('crystal-grid'); }
  window.scrollToFullEncyclopedia = function(){ safeScrollTo(document.querySelector('.featured-divider') || encSearchEl(), 165); };

  // initId2 is defined in the main app — do not override it here

  function stampCrystalCards(){
    document.querySelectorAll('#crystal-grid .crystal-card, #id2-grid .crystal-card').forEach(function(card){
      if(card.dataset.crystalId)return;
      const name=(card.querySelector('.card-name')||{}).textContent || '';
      if(!name || typeof CRYSTALS === 'undefined')return;
      const match=CRYSTALS.find(function(c){return c.n===name.trim();});
      if(match)card.dataset.crystalId=match.i;
    });
  }
  try{
    const oldEncRender=encRender;
    encRender=function(){ oldEncRender(); stampCrystalCards(); };
  }catch(e){}
  try{
    const oldRunId2=runId2;
    runId2=function(){ oldRunId2(); stampCrystalCards(); };
  }catch(e){}

  document.addEventListener('click', function(e){
    const roleCard=e.target.closest && e.target.closest('#s101-roles .role-card');
    if(roleCard && window.matchMedia && window.matchMedia('(max-width: 768px)').matches && !e.target.closest('.role-cta')){
      e.preventDefault();
      e.stopPropagation();
      const shouldOpen=!roleCard.classList.contains('open');
      document.querySelectorAll('#s101-roles .role-card').forEach(card=>{
        const isActive=shouldOpen&&card===roleCard;
        card.classList.toggle('open', isActive);
        card.setAttribute('aria-expanded', String(isActive));
      });
      return;
    }
  }, true);

  document.addEventListener('click', function(e){
    const famCard=e.target.closest && e.target.closest('#fam-cards .fam-card');
    if(famCard){
      const fam=famCard.getAttribute('data-family') || (famCard.querySelector('.fam-name')||{}).textContent;
      if(fam){ e.preventDefault(); e.stopPropagation(); jumpToFamily(fam.trim()); return; }
    }
    const chakraCard=e.target.closest && e.target.closest('#chakra-cards .chakra-card');
    if(chakraCard){
      const name=(chakraCard.querySelector('.chakra-name')||{}).textContent;
      if(name){ e.preventDefault(); e.stopPropagation(); jumpToChakra(name.trim()); return; }
    }
    const card=e.target.closest && e.target.closest('#crystal-grid .crystal-card, #id2-grid .crystal-card');
    if(card){
      // Let image zone clicks fall through to its own onclick (lightbox)
      if(e.target.closest('.card-img-zone')) return;
      const id=card.dataset.crystalId;
      if(id && typeof openDetail==='function'){
        e.preventDefault(); e.stopPropagation();
        openDetail(id);
        return;
      }
    }
    const back=e.target.closest && e.target.closest('.c101-backtop');
    if(back){
      e.preventDefault();
      e.stopPropagation();
      if(back.closest('#tab-101')) window.scrollTo101Top();
      else {
        const tab=back.closest('main > section[id^="tab-"]');
        if(tab && tab.id) window.scrollToTabTop(tab.id.replace('tab-',''));
        else window.scrollTo({top:0,left:0,behavior:'smooth'});
      }
      return;
    }
  }, true);

  document.addEventListener('DOMContentLoaded', function(){
    stampCrystalCards();
    if(document.getElementById('tab-identify')?.style.display !== 'none'){
      try{ initId2(); }catch(e){}
    }
  });
  setTimeout(function(){
    stampCrystalCards();
    const grid=document.getElementById('id2-colors');
    if(grid && !grid.children.length){ try{ initId2(); }catch(e){} }
  },250);
})();

/* ── Styling + 101 back-button injection ── */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .mood-selected-clear{font-size:12.5px!important;color:var(--ink)!important;font-weight:500;letter-spacing:0.02em;}
    #mood-stone-grid .crystal-card{min-height:100%;}
    .c101-backtop-wrap{display:flex!important;justify-content:center!important;margin:2rem 0 0!important;}
  `;
  document.head.appendChild(style);

  function ensure101BackButtons(){
    document.querySelectorAll('#tab-101 .c101-section').forEach(function(section){
      if(!section.querySelector(':scope > .c101-backtop-wrap')){
        section.insertAdjacentHTML('beforeend','<div class="c101-backtop-wrap"><button type="button" class="c101-backtop">Back to top</button></div>');
      }
    });
  }
  document.addEventListener('click',function(e){
    const back=e.target.closest&&e.target.closest('#tab-101 .c101-backtop');
    if(!back)return;
    e.preventDefault();
    e.stopPropagation();
    scrollTo101Top();
  },true);
  document.addEventListener('DOMContentLoaded',ensure101BackButtons);
  setTimeout(ensure101BackButtons,300);

  // Rotate AI search placeholder so repeat visitors see fresh prompts.
  (function(){
    const prompts=[
      'I want a stone for fresh energy, focus, and momentum…',
      'Something to help me feel calm and centered…',
      'I\'m ready for a new chapter and want support…',
      'I want to feel more grounded and present…',
      'A stone for creativity and inspired thinking…',
      'Something to help me feel more confident…',
      'I want to open my heart and attract more love…',
      'I want to attract more abundance and opportunity…',
      'Something for clarity when I have a big decision…',
      'I want to feel more joy and lightness…',
      'A stone to help me trust my intuition…',
      'Something to bring more peace into my home…',
    ];
    let pi=0;
    function rotatePlaceholder(){
      const el=document.getElementById('ai-search-input');
      if(!el||document.activeElement===el)return;
      pi=(pi+1)%prompts.length;
      el.placeholder=prompts[pi];
    }
    setInterval(rotatePlaceholder,4000);
  })();

})();
