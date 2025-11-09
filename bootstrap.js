/*
 * SJR & CORE Rankings Plugin for Zotero 7
 * Bootstrap - Plugin lifecycle dispatcher
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
 * 
 * This file is a simple dispatcher that delegates all lifecycle events
 * to the Hooks module for cleaner architecture and better separation
 * of concerns.
 */

/* global Services, Components, Hooks, Zotero */
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

/**
 * Load all plugin modules in dependency order
 * 
 * @param {string} rootURI - Root URI of the extension
 */
function loadModules(rootURI) {
	const modules = [
		'data.js',           // Rankings data (no dependencies)
		'prefs-utils.js',    // Preference utilities (used by other modules)
		'matching.js',       // Matching algorithms
		'overrides.js',      // Manual overrides
		'ui-utils.js',       // UI utilities
		'rankings.js',       // Main plugin logic
		'hooks.js'           // Lifecycle hooks (loads last)
	];
	
	for (const module of modules) {
		Services.scriptloader.loadSubScript(rootURI + module);
		Zotero.debug(`SJR & CORE Rankings: Loaded ${module}`);
	}
}

/**
 * Bootstrap install hook - called when extension is installed or updated
 * 
 * @param {Object} data - Installation data
 * @param {number} reason - Installation reason constant
 */
function install(data, reason) {
	Hooks.onInstall(data, reason);
}

/**
 * Bootstrap startup hook - called when extension is loaded
 * 
 * @param {Object} params - Startup parameters
 * @param {string} params.id - Extension ID
 * @param {string} params.version - Extension version
 * @param {string} params.rootURI - Root URI of the extension
 */
async function startup({ id, version, rootURI }) {
	loadModules(rootURI);
	await Hooks.onStartup({ id, version, rootURI });
}

/**
 * Bootstrap window load hook - called when a Zotero window opens
 * 
 * @param {Object} params - Window parameters
 * @param {Window} params.window - The window being loaded
 */
function onMainWindowLoad({ window }) {
	Hooks.onMainWindowLoad({ window });
}

/**
 * Bootstrap window unload hook - called when a Zotero window closes
 * 
 * @param {Object} params - Window parameters
 * @param {Window} params.window - The window being unloaded
 */
function onMainWindowUnload({ window }) {
	Hooks.onMainWindowUnload({ window });
}

/**
 * Bootstrap shutdown hook - called when extension is being disabled
 * 
 * @param {Object} params - Shutdown parameters
 * @param {string} params.id - Extension ID
 * @param {string} params.version - Extension version
 * @param {string} params.rootURI - Root URI of the extension
 * @param {number} reason - Shutdown reason constant
 */
function shutdown({ id, version, rootURI }, reason) {
	Hooks.onShutdown({ id, version, rootURI }, reason);
}

/**
 * Bootstrap uninstall hook - called when extension is uninstalled
 * 
 * @param {Object} data - Uninstallation data
 * @param {number} reason - Uninstallation reason constant
 */
function uninstall(data, reason) {
	Hooks.onUninstall(data, reason);
}
