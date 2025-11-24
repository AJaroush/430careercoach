import { useMemo, useState } from 'react';

type Course = {
  id: string;
  title: string;
  provider: string;
  url: string;
  skills: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
};

const COURSE_CATALOG: Course[] = [
  { id: '1', title: 'React for Beginners', provider: 'Coursera', url: 'https://coursera.org', skills: ['react', 'javascript', 'frontend'], level: 'Beginner' },
  { id: '2', title: 'Advanced React Patterns', provider: 'Udemy', url: 'https://udemy.com', skills: ['react', 'hooks', 'performance'], level: 'Advanced' },
  { id: '3', title: 'Data Structures in Python', provider: 'edX', url: 'https://edx.org', skills: ['python', 'algorithms'], level: 'Intermediate' },
  { id: '4', title: 'Machine Learning Foundations', provider: 'Coursera', url: 'https://coursera.org', skills: ['ml', 'python'], level: 'Beginner' },
  { id: '5', title: 'DevOps Essentials', provider: 'Udacity', url: 'https://udacity.com', skills: ['devops', 'ci/cd', 'docker'], level: 'Intermediate' },
];

const JOB_TO_SKILLS: Record<string, string[]> = {
  'frontend_developer': ['react', 'javascript', 'frontend', 'hooks'],
  'backend_developer': ['python', 'algorithms', 'docker'],
  'ml_engineer': ['ml', 'python', 'algorithms'],
  'devops_engineer': ['devops', 'ci/cd', 'docker'],
};

export default function Recommendations() {
  const [job, setJob] = useState('frontend_developer');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All'>('All');

  const recommended = useMemo(() => {
    const skills = JOB_TO_SKILLS[job] ?? [];
    let list = COURSE_CATALOG.filter(c => c.skills.some(s => skills.includes(s)));
    if (level !== 'All') list = list.filter(c => c.level === level);
    return list;
  }, [job, level]);

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-4">Course Recommendations</h1>
      <p className="text-gray-600 mb-6">Get recommended courses based on the job you're applying for.</p>

      <div className="bg-white border rounded-xl p-4 mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm mb-2">Target Job</label>
          <select value={job} onChange={e => setJob(e.target.value)} className="w-full border rounded-lg py-2 px-3">
            <option value="frontend_developer">Frontend Developer</option>
            <option value="backend_developer">Backend Developer</option>
            <option value="ml_engineer">ML Engineer</option>
            <option value="devops_engineer">DevOps Engineer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2">Level</label>
          <select value={level} onChange={e => setLevel(e.target.value as any)} className="w-full border rounded-lg py-2 px-3">
            <option value="All">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommended.map(course => (
          <a key={course.id} href={course.url} target="_blank" rel="noreferrer" className="block bg-white border rounded-xl p-4 hover:shadow-md transition">
            <div className="text-xs text-gray-500">{course.provider}</div>
            <div className="font-semibold text-lg">{course.title}</div>
            <div className="text-xs mt-1">Level: {course.level}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {course.skills.map(s => (
                <span key={s} className="text-xs bg-gray-100 border rounded px-2 py-0.5">{s}</span>
              ))}
            </div>
          </a>
        ))}
        {recommended.length === 0 && (
          <div className="text-gray-600">No courses found for the selected filters.</div>
        )}
      </div>
    </div>
  );
}


