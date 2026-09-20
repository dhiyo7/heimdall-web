export interface TimelineFeature {
  titleKey: string;
  descriptionKey: string;
  subFeatureKeys?: string[];
  done?: boolean;
}

export interface TimelinePhase {
  phaseKey: string;
  descriptionKey: string;
  features: TimelineFeature[];
}

export const roadmapData: TimelinePhase[] = [
  {
    phaseKey: "roadmap.p1_phase",
    descriptionKey: "roadmap.p1_desc",
    features: [
      {
        titleKey: "roadmap.p1_f1_title",
        descriptionKey: "roadmap.p1_f1_desc",
        subFeatureKeys: [
          "roadmap.p1_f1_s1",
          "roadmap.p1_f1_s2"
        ]
      },
      {
        titleKey: "roadmap.p1_f2_title",
        descriptionKey: "roadmap.p1_f2_desc"
      }
    ]
  },
  {
    phaseKey: "roadmap.p2_phase",
    descriptionKey: "roadmap.p2_desc",
    features: [
      {
        titleKey: "roadmap.p2_f1_title",
        descriptionKey: "roadmap.p2_f1_desc",
        subFeatureKeys: [
          "roadmap.p2_f1_s1"
        ]
      },
      {
        titleKey: "roadmap.p2_f2_title",
        descriptionKey: "roadmap.p2_f2_desc"
      }
    ]
  },
  {
    phaseKey: "roadmap.p3_phase",
    descriptionKey: "roadmap.p3_desc",
    features: [
      {
        titleKey: "roadmap.p3_f1_title",
        descriptionKey: "roadmap.p3_f1_desc"
      },
      {
        titleKey: "roadmap.p3_f2_title",
        descriptionKey: "roadmap.p3_f2_desc"
      }
    ]
  },
  {
    phaseKey: "roadmap.p4_phase",
    descriptionKey: "roadmap.p4_desc",
    features: [
      {
        titleKey: "roadmap.p4_f1_title",
        descriptionKey: "roadmap.p4_f1_desc"
      },
      {
        titleKey: "roadmap.p4_f2_title",
        descriptionKey: "roadmap.p4_f2_desc"
      }
    ]
  },
  {
    phaseKey: "roadmap.p5_phase",
    descriptionKey: "roadmap.p5_desc",
    features: [
      {
        titleKey: "roadmap.p5_f1_title",
        descriptionKey: "roadmap.p5_f1_desc"
      }
    ]
  }
];
