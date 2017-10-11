/* * * * * * * * * * * * * * * * * * * * * * * * * * *\
*   _  __                         _ ____        _     *
*  | |/ /                        (_)  _ \      | |    *
*  | ' / __ _ ___  __ _ _ __ ___  _| |_) | ___ | |_   *
*  |  < / _` / __|/ _` | '_ ` _ \| |  _ < / _ \| __|  *
*  | . \ (_| \__ \ (_| | | | | | | | |_) | (_) | |_   *
*  |_|\_\__,_|___/\__,_|_| |_| |_|_|____/ \___/ \__|  *
*                                                     *
*                   Version 1.0.0                     *
*                                                     *
* This is a bot developed for the game Screeps.       *
*                                                     *
* Use this config-file to configure your bot, options *
* are expained below.                                 *
*                                                     *
* More information about the bot at:                  *
* http://kasami.github.io/kasamibot                   *
*                                                     *
* Version history:                                    *
* 1.0 - Cake and grief counseling                     *
* 0.9 - Beta than before                              *
*                                                     *
\* * * * * * * * * * * * * * * * * * * * * * * * * * */

"use strict";
var config = {};

/**
 * config.bot: boolean (default: true)
 * Used to turn on and of bot-functionality. Should stay true.
 * Turning this of will stop autoexpand and a lot of other features.
 */
config.bot = true;


/**
 * config.passive: boolean (default: false)
 * If the bot is passive, it will not try to attack other players.
 * It will still defend it's mining outposts from players and invaders.
 *
 * Set this option to true to prevent the bot from attacking you.
 */
config.passive = false;


/**
 * config.slow: boolean (default: false)
 * If the bot is slow, it will not try to mine as much from remote rooms, and
 * it will not use some of the more advanced features available like mining minerals
 * from unmined lair-rooms and advanced boosting for quicker RCL.
 *
 * Set this option to true to slow the bot progress down.
 */
config.slow = false;


/**
 * config.creditsToMaintain: number (default: 250000)
 * This is the credit-level the bot will try to maintain. If the bot has more credits
 * than this limit, it will start buying minerals it is missing for boosts, energy for
 * boosting, power for processing etc.
 *
 * Set this option to the credit amount you want the bot to keep before spending.
 */
config.creditsToMaintain = 250000;


/**
 * config.powerfocus: boolean (default: false)
 * The default behavior of the bot is to focus on upgrading for GCL. This option
 * can be used to make the bot prefer to use energy on power processing instead
 * of upgrading.
 *
 * Set this option to make the bot prioritize power processing over upgrading
 */
config.powerfocus = false;

module.exports = config;
