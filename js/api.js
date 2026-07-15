window.JamAPI = (() => {
  const STORE_KEY = "jamAdminDataV1";

  function getConfig() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (error) {
      console.warn("Jam config could not be read", error);
      return {};
    }
  }

  function saveConfig(config) {
    localStorage.setItem(STORE_KEY, JSON.stringify(config));
    return config;
  }

  function getContinueAnalysisTemplate() {
    const config = getConfig();
    return config?.prompts?.researchPrompt || `Prepared by Jam — Market Intelligence Assistant

Research Topic:
{{topic}}

Please search the web and provide:
1. Executive Summary
2. Latest verified developments
3. Competitor comparison
4. Impact on CAD/BIM market in Thailand
5. Impact on GstarCAD Thailand / AppliCAD
6. Opportunities and risks
7. Recommended marketing actions
8. Suggested content angles
9. References and official sources

Important:
- Use current web sources.
- Prioritize official and primary sources.
- Separate verified facts from inference.`;
  }

  function buildResearchPrompt(topic) {
    return getContinueAnalysisTemplate().replaceAll("{{topic}}", topic);
  }

  return { STORE_KEY, getConfig, saveConfig, buildResearchPrompt };
})();
