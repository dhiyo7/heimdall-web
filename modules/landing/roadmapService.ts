import { RoadmapPhase, RoadmapFeature } from './roadmapData';
import { roadmapData as fallbackData } from './roadmapData';

const GITHUB_README_URL = 'https://raw.githubusercontent.com/dhiyo7/heimdall/main/Readme.md';

export const fetchRoadmap = async (): Promise<RoadmapPhase[]> => {
    try {
        const response = await fetch(GITHUB_README_URL);
        if (!response.ok) throw new Error('Failed to fetch README');
        const text = await response.text();
        return parseRoadmap(text);
    } catch (error) {
        console.error('Error fetching roadmap:', error);
        return fallbackData; // Fallback to local data
    }
};

const parseRoadmap = (markdown: string): RoadmapPhase[] => {
    const phases: RoadmapPhase[] = [];
    const lines = markdown.split('\n');
    let currentPhase: RoadmapPhase | null = null;
    let captureMode = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Start capturing at the specific header
        if (line.includes('🗺️ HEIMDALL ASCENSION ROADMAP')) {
            captureMode = true;
            continue;
        }

        // Stop capturing if we hit the footer or end of section (heuristic)
        if (captureMode && line.includes('Happy Testing')) {
            break;
        }

        if (!captureMode) continue;

        // Detect Phase Header
        // Example: #### **✅ PHASE 1: THE FOUNDATION (Selesai)**
        if (line.startsWith('#### **')) {
            if (currentPhase) phases.push(currentPhase);

            // Clean up the phase title (remove markdown bold/header chars)
            const phaseTitle = line.replace(/#{4}\s*\*\*(.*?)\*\*/, '$1').trim();

            currentPhase = {
                phase: phaseTitle,
                description: '', // Will look for description in next lines
                features: []
            };

            // Look ahead for description (usually italicized)
            // Example: *Pondasi fisik robot agar kuat...*
            let nextLineIndex = i + 1;
            while (nextLineIndex < lines.length) {
                const nextLine = lines[nextLineIndex].trim();
                if (nextLine && !nextLine.startsWith('* [')) {
                    // It's likely a description line
                    const descMatch = nextLine.match(/^\*(.*?)\*$/);
                    if (descMatch) {
                        currentPhase.description = descMatch[1];
                    }
                    break; // Found description or text, stop looking
                } else if (nextLine.startsWith('* [')) {
                    break; // Hit a feature list, stop looking
                }
                nextLineIndex++;
            }
            continue;
        }

        // Detect Feature
        // Example: * [x] **Title:** Description
        // or: * \[x\] **Title:** Description (escaped)
        const featureMatch = line.match(/^\*\s*\\?\[([ xX])\\?\]/);
        if (featureMatch && currentPhase) {
            const isDone = featureMatch[1].toLowerCase() === 'x';

            // Extract Title and Description
            // Regex to capture: **Title:** Description
            // Matches both * [x] **Title:** ... and * \[x\] **Title:** ...
            const contentMatch = line.match(/\\?\]\s*\*\*(.*?):\*\*\s*(.*)/);

            if (contentMatch) {
                const title = contentMatch[1];
                const desc = contentMatch[2];

                const feature: RoadmapFeature = {
                    title: `${title}: ${desc}`,
                    done: isDone
                };
                currentPhase.features.push(feature);
            } else {
                // Fallback simpler match if format differs
                const simpleMatch = line.match(/\\?\]\s*(.*)/);
                if (simpleMatch) {
                    const feature: RoadmapFeature = {
                        title: simpleMatch[1],
                        done: isDone
                    };
                    currentPhase.features.push(feature);
                }
            }
            continue;
        }

        // Detect Subfeature
        // Example:   * **Dashboard GUI:** Text
        const subMatch = line.match(/^\s*\*\s*\*\*(.*?)\*\*(.*)/);
        if (subMatch && currentPhase && currentPhase.features.length > 0) {
            // This is a sub-feature of the last added feature
            const lastFeature = currentPhase.features[currentPhase.features.length - 1];
            const subTitle = subMatch[1];
            const subRest = subMatch[2]; // usually begins with : or similar

            let subText = `${subTitle}${subRest}`;
            // Clean up leading colon if present
            if (subText.startsWith(':')) {
                subText = `${subTitle}: ${subRest.substring(1).trim()}`;
            } else {
                // Reconstruct if it was just bolded title + text
                subText = `${subTitle}${subRest}`;
            }

            if (!lastFeature.subFeatures) {
                lastFeature.subFeatures = [];
            }
            lastFeature.subFeatures.push(subText);
        }
    }

    // Push the last phase
    if (currentPhase) phases.push(currentPhase);

    return phases.length > 0 ? phases : fallbackData;
};

export const parseMarkdown = (text: string): string => {
    if (!text) return '';

    // 1. Bold: **text**
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 2. Italic: *text* (careful not to break other regex, usually simple * works)
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 3. Code: `text`
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-800 px-1 rounded font-bold text-xs">$1</code>');

    // 4. Links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-blue-600 dark:text-blue-400 hover:text-black dark:hover:text-white">$1</a>');

    return html;
};
