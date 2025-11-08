/*
 * SJR & CORE Rankings Plugin for Zotero 7
 * 
 * Copyright (C) 2025 Ben Stephens
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/* global Services, Components */
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

function log(msg) {
	Zotero.debug("SJR & CORE Rankings: " + msg);
}

/**
 * Called when the extension is installed or updated
 */
function install(data, reason) {
	log("Installing plugin");
}

/**
 * Called when the extension is started
 */
async function startup({ id, version, rootURI }) {
	log("========================================");
	log("STARTUP CALLED - Version: " + version);
	log("========================================");
	
	// Set default preferences if not already set
	if (Zotero.Prefs.get('extensions.sjr-core-rankings.autoUpdate') === undefined) {
		Zotero.Prefs.set('extensions.sjr-core-rankings.autoUpdate', true);
	}
	
	// Set CORE database preference (enabled by default)
	if (Zotero.Prefs.get('extensions.sjr-core-rankings.enableCORE') === undefined) {
		Zotero.Prefs.set('extensions.sjr-core-rankings.enableCORE', true);
	}
	
	log("Preferences set");
	
	// Register preference pane using official Zotero 7 API
	log("Registering preference pane");
	Zotero.PreferencePanes.register({
		pluginID: 'sjr-core-rankings@zotero.org',
		src: rootURI + 'preferences.xhtml',
		label: 'Rankings'
	});
	log("Preference pane registered");
	
	// Load the ranking data and code (files are in root of XPI)
	// Load directly without sandbox for simpler global variable access
	log("rootURI: " + rootURI);
	log("Loading data.js from: " + rootURI + 'data.js');
	
	Services.scriptloader.loadSubScript(rootURI + 'data.js');
	log("data.js loaded successfully");
	
	Services.scriptloader.loadSubScript(rootURI + 'rankings.js');
	log("rankings.js loaded successfully");
	
	// Attach to Zotero object for global access
	if (!Zotero.SJRCoreRankings) {
		Zotero.SJRCoreRankings = ZoteroRankings;
	}
	
	log("Plugin attached to Zotero.SJRCoreRankings");
	
	// Initialize the plugin
	log("Calling init()");
	await Zotero.SJRCoreRankings.init({ id, version, rootURI });
	log("Init complete, calling addToAllWindows()");
	Zotero.SJRCoreRankings.addToAllWindows();
	log("Startup complete");
}

/**
 * Called when a main Zotero window is opened (Zotero 7)
 */
function onMainWindowLoad({ window }) {
	Zotero.SJRCoreRankings?.addToWindow(window);
}

/**
 * Called when a main Zotero window is closed (Zotero 7)
 */
function onMainWindowUnload({ window }) {
	Zotero.SJRCoreRankings?.removeFromWindow(window);
}

/**
 * Called when the extension is shutting down
 */
function shutdown({ id, version, resourceURI, rootURI }) {
	log("Shutting down plugin");
	
	if (Zotero.SJRCoreRankings) {
		Zotero.SJRCoreRankings.removeFromAllWindows();
		delete Zotero.SJRCoreRankings;
	}
}

/**
 * Called when the extension is uninstalled
 */
function uninstall(data, reason) {
	log("Uninstalling plugin");
}
