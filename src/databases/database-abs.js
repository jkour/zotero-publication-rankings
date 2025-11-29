/**
 * ABS Database Plugin
 *
 * CABS Journal Rankings (ABS) database matching strategies.
 *
 * Data source: absRankings global object from data.js
 */

/* global Zotero, sjrRankings, MatchingUtils, DatabaseRegistry */

var absDatabase = {
	/**
	* Main Matching Function
    * @param {string} title - Publication title to match
	* @param {Function} debugLog - Debug logging function
	* @returns {string|null} Ranking string (e.g., "1" or "4*") or N/A if not found
 */
	match: function (title, debugLog) {
		debugLog(`[ABS] Retrieving ranking from database...`);

		var result = ''
		for (var absTitle in absRankings) {
			if (title.trim().toLowerCase() == absTitle.trim().toLowerCase()) {
				debugLog(`[ABS] ✓ Journal Found: "${absTitle}" -> $(absRankings[absTitle])`);
				result = absRankings[absTitle].abs;
				break;
            }
        }

		if ((result == 'N/A') || (!result)) {
			debugLog('[ABS] Journal NOT found: "${title}"');
		}

		return result;
	}
}

DatabaseRegistry.register({
	id: 'abs',
	name: 'ABS Journal Ranking',
	prefKey: 'enableABS',
	priority: 101,
	matcher: function (title, debugLog) {
		return absDatabase.match(title, debugLog);
    }
})