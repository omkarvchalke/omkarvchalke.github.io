import type { Publication } from "./types";

export const publications: Publication[] = [
  {
    slug: "vehicle-license-plate-recognition-neural-networks",
    title: "Vehicle License Plate Recognition Using Neural Networks",
    abstract:
      "A Vehicle License Plate Recognition System (VLPRS) for real-time detection and recognition of license plates, aimed at traffic-rule monitoring, security, automated toll/fine calculation, and vehicle tracking. Proposes a lightweight, multi-angle detection model built on convolutional neural networks to keep computational complexity low without sacrificing accuracy.",
    problem:
      "Manual license-plate monitoring doesn't scale for traffic enforcement, security, or toll/fine automation — these use cases need real-time, multi-angle recognition that stays computationally cheap enough to run continuously.",
    methods:
      "A CNN-based multi-angle license plate detection model, designed to be lighter and faster than heavier detection pipelines while maintaining accuracy — reducing both procedural and computational complexity.",
    techSlugs: ["python", "tensorflow", "opencv", "tesseract"],
    citation:
      "Gondhalekar, Dnyanisha and Chalke, Omkar and Bansal, Siddharth and Banerjee, Soumi, Vehicle License Plate Recognition Using Neural Networks (May 7, 2021). Proceedings of the 4th International Conference on Advances in Science & Technology (ICAST2021), Available at SSRN: https://ssrn.com/abstract=3866116 or http://dx.doi.org/10.2139/ssrn.3866116",
    pdfUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3866116",
    relatedProjectSlug: "vehicle-license-plate-recognition",
  },
];
