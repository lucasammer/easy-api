module.exports = {
  execute(res, req, headers) {
    res.json(JSON.parse('{"status": "ok","errors": false}'));
    return;
  },
};