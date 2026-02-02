import db from '../db.js';

export function listProjects(req, res) {
  const { teamId } = req.query;
  
  let query = `SELECT p.* FROM projects p
       JOIN team_members tm ON tm.team_id = p.team_id
       WHERE tm.user_id = ?`;
  
  const params = [req.user.id];
  
  // Filter by teamId if provided
  if (teamId) {
    query += ` AND p.team_id = ?`;
    params.push(teamId);
  }
  
  query += ` ORDER BY p.created_at DESC`;
  
  const rows = db.prepare(query).all(...params);
  res.json(rows);
}

export function createProject(req, res) {
  const { teamId, name, description } = req.body || {};
  if (!teamId || !name) return res.status(400).json({ error: 'teamId and name required' });
  const member = db.prepare('SELECT 1 FROM team_members WHERE team_id = ? AND user_id = ?').get(teamId, req.user.id);
  if (!member) return res.status(403).json({ error: 'Not a team member' });
  const info = db.prepare('INSERT INTO projects (team_id, name, description) VALUES (?,?,?)').run(teamId, name, description || null);
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(project);
}
