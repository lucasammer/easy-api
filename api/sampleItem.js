/**
 *  Default API module for the easy api framework.
 *  This file does not get updated.
 *  @module sampleItem
 *  @description sends status ok with no errors
 */

module.exports = {
  execute(res, req, headers) {
    res.json(JSON.parse('{"status": "ok","errors": false}'));
    return;
  },
};
