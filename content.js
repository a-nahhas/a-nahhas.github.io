/**
 * EDIT YOUR PORTFOLIO CONTENT HERE
 * --------------------------------
 * Change any text between quotation marks. To add a module, copy one complete
 * module object, give it a unique slug, then copy one of the module folders and
 * update the data-module value in that folder's index.html.
 */

window.PORTFOLIO_CONTENT = {
  owner: 'Ali Nahhas',
  program: {
    shortName: 'MSc Artificial Intelligence',
    title: 'Master’s in Artificial Intelligence',
    university: 'University of Essex',
    mode: 'Online study',
    status: 'In progress',
    summary:
      'I am studying for an MSc in Artificial Intelligence at the University of Essex. This portfolio documents my module work, practical activities, critical reflections, and assessments as the programme progresses.',
  },
  modules: [
    {
      slug: 'intelligent-agents',
      code: 'IA',
      title: 'Intelligent Agents',
      description:
        'Exploring autonomous systems, agent architectures, reasoning, communication, and decision-making in dynamic environments.',
      term: 'Module 01',
      accent: 'linear-gradient(145deg, #ff9c59, #ff5364 55%, #8d5cff)',
      icon: 'agents',
      overview:
        'This module examines how intelligent agents perceive environments, select actions, collaborate, and adapt. The portfolio connects foundational theory with practical approaches to designing autonomous and multi-agent systems.',
      topics: [
        'Agent architectures and environments',
        'Reasoning and decision-making',
        'Communication and cooperation',
        'Ethics of autonomous systems',
      ],
      journal: [
        {
          label: 'Learning journal',
          text: 'Weekly reflections and key ideas will be added here.',
        },
        {
          label: 'Practical activities',
          text: 'Agent models, exercises, and experiments will appear here.',
        },
      ],
    },
    {
      slug: 'machine-learning',
      code: 'ML',
      title: 'Machine Learning',
      description:
        'Studying how models learn from data, from core statistical ideas to evaluation, responsible practice, and real-world application.',
      term: 'Module 02',
      accent: 'linear-gradient(145deg, #ff6576, #b15cff 58%, #5667ff)',
      icon: 'learning',
      overview:
        'This module develops a practical and critical understanding of machine learning. The portfolio documents the full process: preparing data, selecting and training models, evaluating results, and considering their wider impact.',
      topics: [
        'Supervised and unsupervised learning',
        'Data preparation and feature design',
        'Model training and evaluation',
        'Responsible machine learning',
      ],
      journal: [
        {
          label: 'Learning journal',
          text: 'Weekly reflections and key ideas will be added here.',
        },
        {
          label: 'Practical activities',
          text: 'Notebooks, model experiments, and results will appear here.',
        },
      ],
    },
  ],
}
