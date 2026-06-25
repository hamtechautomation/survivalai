/* shared-progress.js — Skills & Teaching Hub shared localStorage data layer */
'use strict';

const SharedProgress = (() => {
  const P = 'sp_'; // namespace prefix

  function k(key) { return P + key; }
  function get(key) { return localStorage.getItem(k(key)); }
  function set(key, val) { localStorage.setItem(k(key), val); }
  function getJSON(key, def) {
    try { return JSON.parse(get(key)) ?? def; } catch { return def; }
  }
  function setJSON(key, val) { set(key, JSON.stringify(val)); }

  // ── Practice tracking ─────────────────────────────────────────────
  function getPracticeCount(id) { return parseInt(get('practice_' + id) || '0', 10); }
  function incrementPractice(id) {
    const n = getPracticeCount(id) + 1;
    set('practice_' + id, n);
    _recordSession(id, 'practice');
    return n;
  }

  // ── Competency levels ─────────────────────────────────────────────
  const COMPETENCY_LEVELS = ['none', 'getting-there', 'competent', 'can-teach'];
  function getCompetency(id) { return get('competency_' + id) || 'none'; }
  function setCompetency(id, level) {
    if (COMPETENCY_LEVELS.includes(level)) set('competency_' + id, level);
  }

  // ── Taught tracking ───────────────────────────────────────────────
  function getTaughtCount(id) { return parseInt(get('taught_' + id) || '0', 10); }
  function incrementTaught(id) {
    const n = getTaughtCount(id) + 1;
    set('taught_' + id, n);
    _recordSession(id, 'taught');
    return n;
  }

  // ── Students ──────────────────────────────────────────────────────
  function getStudents() { return getJSON('students', []); }
  function saveStudents(students) { setJSON('students', students); }

  function addStudent(name, role) {
    const students = getStudents();
    const student = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: name || 'Unnamed',
      role: role || '',
      skills: {},
      notes: '',
      added: new Date().toISOString().slice(0, 10)
    };
    students.push(student);
    saveStudents(students);
    return student;
  }

  function updateStudent(id, data) {
    const students = getStudents();
    const i = students.findIndex(s => s.id === id);
    if (i === -1) return null;
    students[i] = { ...students[i], ...data };
    saveStudents(students);
    return students[i];
  }

  function removeStudent(id) {
    saveStudents(getStudents().filter(s => s.id !== id));
  }

  // skill status: 'none'|'introduced'|'practising'|'competent'|'can-teach'
  function setStudentSkill(studentId, skillId, status) {
    const students = getStudents();
    const s = students.find(s => s.id === studentId);
    if (!s) return;
    s.skills = s.skills || {};
    s.skills[skillId] = status;
    saveStudents(students);
  }

  // ── Curriculum progress ───────────────────────────────────────────
  function getCurriculumProgress() { return getJSON('curr_progress', {}); }
  function setWeekProgress(weekNum, data) {
    const prog = getCurriculumProgress();
    prog[weekNum] = { ...prog[weekNum], ...data, date: new Date().toISOString().slice(0, 10) };
    setJSON('curr_progress', prog);
  }

  // ── Sessions ──────────────────────────────────────────────────────
  function getSessions() { return getJSON('sessions', []); }
  function addSession(data) {
    const sessions = getSessions();
    sessions.unshift({ id: Date.now().toString(36), date: new Date().toISOString().slice(0, 10), ...data });
    if (sessions.length > 500) sessions.splice(500);
    setJSON('sessions', sessions);
    return sessions[0];
  }
  function _recordSession(skillId, type) {
    addSession({ skillId, type });
  }

  // ── Assessments ───────────────────────────────────────────────────
  function getAssessments() { return getJSON('assessments', []); }
  function addAssessment(data) {
    const assessments = getAssessments();
    assessments.unshift({ id: Date.now().toString(36), date: new Date().toISOString().slice(0, 10), ...data });
    setJSON('assessments', assessments);
    return assessments[0];
  }

  // ── Instructor / group ────────────────────────────────────────────
  function getInstructorName() { return get('instructor_name') || ''; }
  function setInstructorName(name) { set('instructor_name', name); }

  // ── Lesson plan notes ─────────────────────────────────────────────
  function getLessonPlanNotes(planId) { return get('lessonplan_notes_' + planId) || ''; }
  function setLessonPlanNotes(planId, notes) { set('lessonplan_notes_' + planId, notes); }

  // ── Session start date (for curriculum week tracking) ──────────────
  function getSessionStartDate() { return get('session_start_date') || ''; }
  function setSessionStartDate(date) { set('session_start_date', date); }

  // ── Group statistics ─────────────────────────────────────────────
  function getGroupStats(allSkillIds) {
    const students = getStudents();
    const sessions = getSessions();
    const today = new Date().toISOString().slice(0, 10);
    const thisMonth = today.slice(0, 7);

    const sessionsThisMonth = sessions.filter(s => (s.date || '').startsWith(thisMonth)).length;
    const totalPractices = allSkillIds.reduce((sum, id) => sum + getPracticeCount(id), 0);

    const competentSkills = allSkillIds.filter(id => {
      const hasCompetent = students.some(s => (s.skills?.[id] || 'none') === 'competent' || (s.skills?.[id] || 'none') === 'can-teach');
      return hasCompetent || getCompetency(id) === 'competent' || getCompetency(id) === 'can-teach';
    });

    const criticalGaps = allSkillIds.filter(id => {
      const competentCount = students.filter(s => {
        const lvl = s.skills?.[id] || 'none';
        return lvl === 'competent' || lvl === 'can-teach';
      }).length;
      return competentCount === 0;
    });

    return {
      studentCount: students.length,
      competentSkillCount: competentSkills.length,
      criticalGapCount: criticalGaps.length,
      criticalGaps,
      sessionsThisMonth,
      totalPractices,
      instructorName: getInstructorName()
    };
  }

  // ── Export / import ───────────────────────────────────────────────
  function exportAll() {
    const data = {
      exported: new Date().toISOString(),
      version: 1,
      students: getStudents(),
      curriculumProgress: getCurriculumProgress(),
      sessions: getSessions(),
      assessments: getAssessments(),
      instructorName: getInstructorName(),
      sessionStartDate: getSessionStartDate(),
    };
    // Capture all sp_ keys for practice/competency/taught
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(P)) {
        const shortKey = key.slice(P.length);
        if (shortKey.startsWith('practice_') || shortKey.startsWith('competency_') || shortKey.startsWith('taught_') || shortKey.startsWith('lessonplan_notes_')) {
          data[shortKey] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lastlight-progress-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    set('last_export', new Date().toISOString().slice(0, 10));
  }

  function importAll(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      if (data.students) saveStudents(data.students);
      if (data.curriculumProgress) setJSON('curr_progress', data.curriculumProgress);
      if (data.sessions) setJSON('sessions', data.sessions);
      if (data.assessments) setJSON('assessments', data.assessments);
      if (data.instructorName) set('instructor_name', data.instructorName);
      if (data.sessionStartDate) set('session_start_date', data.sessionStartDate);
      // Restore practice/competency/taught/notes
      Object.keys(data).forEach(key => {
        if (key.startsWith('practice_') || key.startsWith('competency_') || key.startsWith('taught_') || key.startsWith('lessonplan_notes_')) {
          set(key, data[key]);
        }
      });
      return true;
    } catch { return false; }
  }

  function getLastExportDate() { return get('last_export') || ''; }

  return {
    COMPETENCY_LEVELS,
    getPracticeCount, incrementPractice,
    getCompetency, setCompetency,
    getTaughtCount, incrementTaught,
    getStudents, addStudent, updateStudent, removeStudent, setStudentSkill,
    getCurriculumProgress, setWeekProgress,
    getSessions, addSession,
    getAssessments, addAssessment,
    getInstructorName, setInstructorName,
    getLessonPlanNotes, setLessonPlanNotes,
    getSessionStartDate, setSessionStartDate,
    getGroupStats,
    exportAll, importAll, getLastExportDate
  };
})();
