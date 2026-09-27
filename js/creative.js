const topics = [
  {
    name: "DAS",
    x: 50,
    y: 18,
    description:
      "Distributed Alignment Search is a technique for testing whether an internal subspace of a model has a causal role in its behavior.",
    connection:
      "Connects to mechanistic interpretability, activation interventions, and representation analysis.",
  },
  {
    name: "LLMs",
    x: 79,
    y: 34,
    description:
      "Large language models are the main systems I study when asking how internal representations support reasoning and retrieval.",
    connection: "Connects to DAS, NLP, reliability, and interpretability.",
  },
  {
    name: "Graphs",
    x: 82,
    y: 70,
    description:
      "Graph structures were central to my citation-network research, where papers and citation relationships formed the analysis space.",
    connection:
      "Connects to citation analysis, network patterns, and explainable structure.",
  },
  {
    name: "Speech",
    x: 50,
    y: 84,
    description:
      "My IIIT Bangalore internship explored self-supervised clustering methods for learning speech representations without labels.",
    connection:
      "Connects to DeepCluster, self-supervised learning, and representation learning.",
  },
  {
    name: "Time Series",
    x: 19,
    y: 70,
    description:
      "I have explored nonlinear dynamics and forecasting using sports time-series data from basketball and football.",
    connection:
      "Connects to forecasting, chaos analysis, and evaluation of sequential data.",
  },
  {
    name: "NLP",
    x: 20,
    y: 34,
    description:
      "Natural language processing appears across my work in citation analysis, language-model research, and model evaluation.",
    connection:
      "Connects to LLMs, research integrity, and language-based decision systems.",
  },
];

const ideaTemplates = [
  "Could ideas from {first} help design a better experiment for {second}?",
  "What would happen if we applied {first} methods to the {second} problem?",
  "Is there a hidden connection between {first} and {second} nobody has fully explored?",
  "What would a {first} researcher notice about {second} that others might miss?",
  "If {first} and {second} are really the same problem in disguise, what is the unifying principle?",
  "How would a {first} lens change the evaluation criteria we use for {second}?",
];

const researchQuestions = [
  "When a language model solves a reasoning task, is it understanding the structure — or retrieving a cached pattern from training?",
  "Could mechanistic interpretability tools like DAS tell us not just how a model works, but why certain training decisions matter?",
  "If self-supervised speech representations capture phoneme structure, what other latent linguistic properties might they encode?",
  "When does a citation network reveal genuine intellectual lineage — and when does it just reflect who knows whom?",
  "What does it mean for a model's internal representation to be causally responsible for its output?",
  "Is there a mathematical equivalence between detecting anomalous patterns in citation graphs and in other social networks?",
  "How do we evaluate whether a discovered circuit in an LLM is a real mechanism or an artifact of our analysis method?",
  "Can nonlinear dynamics from sports performance data tell us anything fundamental about human decision-making under pressure?",
  "Is there a principled way to measure how much a model understands versus memorizes?",
  "What would it look like if a language model could diagnose its own failure modes in plain language?",
];

const constellation = document.querySelector("#constellation");
const detailTitle = document.querySelector("#detail-title");
const detailDescription = document.querySelector("#detail-description");
const detailConnection = document.querySelector("#detail-connection");
const ideaButton = document.querySelector("#idea-button");
const ideaOutput = document.querySelector("#idea-output");

function selectTopic(topic, button) {
  document.querySelectorAll(".topic-node").forEach((node) => {
    node.classList.remove("selected");
  });

  button.classList.add("selected");
  detailTitle.textContent = topic.name;
  detailDescription.textContent = topic.description;
  detailConnection.textContent = topic.connection;
}

function renderTopics() {
  topics.forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "topic-node";
    button.textContent = topic.name;
    button.style.left = `${topic.x}%`;
    button.style.top = `${topic.y}%`;
    button.setAttribute("aria-label", `View details about ${topic.name}`);
    button.addEventListener("click", () => selectTopic(topic, button));
    constellation.append(button);
  });
}

function generateIdea() {
  const firstIndex = Math.floor(Math.random() * topics.length);
  let secondIndex = Math.floor(Math.random() * topics.length);

  while (secondIndex === firstIndex) {
    secondIndex = Math.floor(Math.random() * topics.length);
  }

  const first = topics[firstIndex].name;
  const second = topics[secondIndex].name;
  const template =
    ideaTemplates[Math.floor(Math.random() * ideaTemplates.length)];
  ideaOutput.textContent = template
    .replace("{first}", first)
    .replace("{second}", second);
}

renderTopics();
ideaButton.addEventListener("click", generateIdea);

const questionText = document.querySelector("#question-text");
const questionCount = document.querySelector("#q-count");
const qPrev = document.querySelector("#q-prev");
const qNext = document.querySelector("#q-next");

let questionIndex = 0;

function showQuestion(index) {
  if (!questionText || !questionCount) return;
  questionText.textContent = researchQuestions[index];
  questionCount.textContent = `${index + 1} / ${researchQuestions.length}`;
}

if (questionText) {
  showQuestion(questionIndex);

  qNext.addEventListener("click", () => {
    questionIndex = (questionIndex + 1) % researchQuestions.length;
    showQuestion(questionIndex);
  });

  qPrev.addEventListener("click", () => {
    questionIndex =
      (questionIndex - 1 + researchQuestions.length) % researchQuestions.length;
    showQuestion(questionIndex);
  });
}
