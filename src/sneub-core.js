(function exposeSneubCore(root, factory) {
  const core = factory();
  if (typeof module === "object" && module.exports) module.exports = core;
  else root.SneubCore = core;
})(typeof globalThis !== "undefined" ? globalThis : this, function createSneubCore() {
  const CUSTOM_ANSWER = "__custom__";
  const CUSTOM_ANSWER_MAX_CHARS = 500;
  const ANALYSIS_STATES = ["good", "warn", "bad", "unclear"];
  const SCORING_STATES = ["good", "warn", "bad"];

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function createEmptyState() {
    return { i: 0, a: {}, c: {}, w: {}, syn: {}, anos: "" };
  }

  function normalizeState(value) {
    if (!isRecord(value)) return createEmptyState();
    const index = Number(value.i);
    return {
      i: Number.isInteger(index) && index >= 0 ? index : 0,
      a: isRecord(value.a) ? value.a : {},
      c: isRecord(value.c) ? value.c : {},
      w: isRecord(value.w) ? value.w : {},
      syn: isRecord(value.syn) ? value.syn : {},
      anos: typeof value.anos === "string" ? value.anos : ""
    };
  }

  function allowsCustomAnswer(question) {
    return question.allowCustom !== false;
  }

  function questionThemes(question) {
    return [...new Set(question.opts.flatMap((option) => Object.keys(option.themes || {})))];
  }

  function hasValidCustomAnswer(state, question) {
    return state.a[question.id] === CUSTOM_ANSWER &&
      typeof state.c[question.id] === "string" &&
      state.c[question.id].trim().length > 0 &&
      state.c[question.id].length <= CUSTOM_ANSWER_MAX_CHARS;
  }

  function safetyLocked(questions, state) {
    const question = questions.find((item) => item.id === "seguranca");
    const index = state.a.seguranca;
    const option = question && Number.isInteger(index) ? question.opts[index] : null;
    return Boolean(option && option.tone === "r");
  }

  function safetyModeAt(questions, state, index) {
    return questions.slice(0, index + 1).some((question) => {
      const answer = state.a[question.id];
      const option = Number.isInteger(answer) ? question.opts[answer] : null;
      return Boolean(option && option.tone === "r");
    });
  }

  function commentPayload(questions, state, item, selectedIndex) {
    const index = questions.indexOf(item);
    const selected = item.opts[selectedIndex];
    if (index < 0 || !selected) return null;
    return {
      question: { id: item.id, chapter: item.ch, text: item.q },
      selected: {
        index: selectedIndex,
        text: selected.t,
        tone: selected.tone,
        themes: selected.themes || {}
      },
      previous: questions.slice(0, index).flatMap((question) => {
        const answer = state.a[question.id];
        const option = Number.isInteger(answer) ? question.opts[answer] : null;
        if (!option) return [];
        return [{
          questionId: question.id,
          chapter: question.ch,
          questionText: question.q,
          optionIndex: answer,
          optionText: option.t,
          tone: option.tone,
          themes: option.themes || {}
        }];
      })
    };
  }

  function mergeCustomSignals(questions, state, bag, customAnalysis) {
    if (!isRecord(customAnalysis)) return bag;
    questions.forEach((question) => {
      if (!hasValidCustomAnswer(state, question)) return;
      const result = customAnalysis[question.id];
      if (!isRecord(result) || !SCORING_STATES.includes(result.state)) return;
      questionThemes(question).forEach((theme) => {
        if (!bag[theme]) bag[theme] = { good: 0, warn: 0, bad: 0 };
        bag[theme][result.state]++;
      });
    });
    return bag;
  }

  function patterns(questions, state, customAnalysis) {
    const bag = {};
    questions.forEach((question) => {
      const answer = state.a[question.id];
      const option = Number.isInteger(answer) ? question.opts[answer] : null;
      if (!option) return;
      Object.entries(option.themes || {}).forEach(([theme, value]) => {
        if (!bag[theme]) bag[theme] = { good: 0, warn: 0, bad: 0 };
        bag[theme][value]++;
      });
    });
    mergeCustomSignals(questions, state, bag, customAnalysis);
    return Object.entries(bag).map(([key, value]) => {
      const n = value.good + value.warn + value.bad;
      const heat = (value.bad * 2 + value.warn) / Math.max(1, n);
      return { k: key, ...value, n, heat };
    }).sort((left, right) => right.heat - left.heat || right.n - left.n);
  }

  function collectCustomAnswers(questions, state) {
    return questions.flatMap((question) => {
      if (!allowsCustomAnswer(question) || !hasValidCustomAnswer(state, question)) return [];
      return [{
        id: question.id,
        chapter: question.ch,
        question: question.q,
        text: state.c[question.id].trim(),
        themes: questionThemes(question)
      }];
    });
  }

  function validAnalysisProbabilities(value) {
    if (!isRecord(value) || Object.keys(value).sort().join(",") !== "bad,good,unclear,warn") return false;
    const probabilities = ANALYSIS_STATES.map((key) => value[key]);
    return probabilities.every((number) => Number.isFinite(number) && number >= 0 && number <= 1) &&
      Math.abs(probabilities.reduce((sum, number) => sum + number, 0) - 1) <= 0.001;
  }

  function validCustomAnalysis(value, answers) {
    if (!isRecord(value) || Object.keys(value).some((key) => key !== "analysis") || !isRecord(value.analysis)) {
      return null;
    }
    const expectedIds = answers.map((answer) => answer.id).sort();
    if (Object.keys(value.analysis).sort().join(",") !== expectedIds.join(",")) return null;
    for (const id of expectedIds) {
      const result = value.analysis[id];
      if (!isRecord(result) ||
          Object.keys(result).sort().join(",") !== "confidence,probabilities,state" ||
          !ANALYSIS_STATES.includes(result.state) ||
          !Number.isFinite(result.confidence) || result.confidence < 0 || result.confidence > 1 ||
          !validAnalysisProbabilities(result.probabilities)) return null;
    }
    return value.analysis;
  }

  return {
    ANALYSIS_STATES,
    CUSTOM_ANSWER,
    CUSTOM_ANSWER_MAX_CHARS,
    allowsCustomAnswer,
    collectCustomAnswers,
    commentPayload,
    createEmptyState,
    hasValidCustomAnswer,
    isRecord,
    mergeCustomSignals,
    normalizeState,
    patterns,
    questionThemes,
    safetyLocked,
    safetyModeAt,
    validAnalysisProbabilities,
    validCustomAnalysis
  };
});
