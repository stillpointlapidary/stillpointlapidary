'use strict';

/**
 * Single source of truth for canonical Still Point Lapidary paths that live
 * outside the Website repo. See Project Rules/CLAUDE.md §4 ("Exact Active
 * Paths") for the authoritative list this file mirrors.
 *
 * Scripts that need one of these paths should import it from here rather
 * than hard-coding a second copy.
 */

const path = require('path');

const PRODUCTION_MASTER_PATH = 'C:\\Users\\chris\\Documents\\Still Point Lapidary\\Encyclopedia\\Production Data\\Still-Point-Lapidary-Production-Master.xlsx';
const CANONICAL_MDS_ROOT = 'C:\\Users\\chris\\Documents\\Still Point Lapidary\\Encyclopedia\\Canonical MDs';
const RESEARCH_ROOT = 'C:\\Users\\chris\\Documents\\Still Point Lapidary\\Encyclopedia\\Research';

// Repo-relative — these are pipeline working files, not external canonical sources.
const PIPELINE_OUTPUT_DIR = path.join(__dirname, '..', 'output');
const STRUCTURED_EXPORT_PATH = path.join(__dirname, '..', 'data', 'structured-values.generated.json');

module.exports = {
  PRODUCTION_MASTER_PATH,
  CANONICAL_MDS_ROOT,
  RESEARCH_ROOT,
  PIPELINE_OUTPUT_DIR,
  STRUCTURED_EXPORT_PATH,
};
