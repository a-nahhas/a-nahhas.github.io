import agentBasedSystems from './entries/intelligent-agents/01-agent-based-systems.js';
import creatingAgentDialogues from './entries/intelligent-agents/03-creating-agent-dialogues.js';
import teamProject from './entries/intelligent-agents/04-team-project.js';
import creatingParseTrees from './entries/intelligent-agents/05-creating-parse-trees.js';
import deepLearningDiscussion from './entries/intelligent-agents/06-deep-learning-discussion.js';
import deepLearningInAction from './entries/intelligent-agents/07-deep-learning-in-action.js';
import individualPresentation from './entries/intelligent-agents/08-individual-presentation.js';
import reflectiveCaseStudies from './entries/intelligent-agents/09-reflective-case-studies.js';
import finalReflection from './entries/intelligent-agents/10-final-reflection.js';
import fourthIndustrialRevolution from './entries/machine-learning/01-fourth-industrial-revolution.js';
import jaccardCoefficient from './entries/machine-learning/02-jaccard-coefficient.js';
import mlTeamProject from './entries/machine-learning/03-team-project.js';
import correlationAndRegression from './entries/machine-learning/04-correlation-and-regression.js';
import perceptrons from './entries/machine-learning/05-perceptrons.js';
import gradientDescent from './entries/machine-learning/05-gradient-descent.js';
import cnnObjectRecognition from './entries/machine-learning/07-cnn-object-recognition.js';
import mlIndividualPresentation from './entries/machine-learning/08-individual-presentation.js';
import modelPerformanceMeasurement from './entries/machine-learning/09-model-performance-measurement.js';
import mlFinalReflection from './entries/machine-learning/10-final-reflection.js';

/**
 * EDIT YOUR GENERAL PORTFOLIO CONTENT HERE
 * -----------------------------------------
 * Portfolio entries live in separate files inside the entries folder so each
 * one can be edited without searching through this file.
 */

const portfolioContent = {
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
        agentBasedSystems,
        creatingAgentDialogues,
        teamProject,
        creatingParseTrees,
        deepLearningDiscussion,
        deepLearningInAction,
        individualPresentation,
        reflectiveCaseStudies,
        finalReflection,
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
      journal: [fourthIndustrialRevolution, jaccardCoefficient, correlationAndRegression, mlTeamProject, perceptrons, gradientDescent, cnnObjectRecognition, mlIndividualPresentation, modelPerformanceMeasurement, mlFinalReflection],
    },
  ],
};

export default portfolioContent;
