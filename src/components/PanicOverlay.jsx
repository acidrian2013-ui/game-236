import React from 'react';
import { FileText, ArrowLeft, Search } from 'lucide-react';
import { playUiSound } from '../utils/audio.js';

export const PanicOverlay = ({ onDismiss, panicKey }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-[#202124] flex flex-col font-sans select-none">
      {/* Top Bar resembling Google Docs / Workspace */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-800">Biology 101 - Cell Respiration Study Notes</span>
              <span className="text-xs text-gray-400">· Saved to Drive</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600 mt-0.5">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Tools</span>
              <span>Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-xs text-gray-600">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span>Search document...</span>
          </div>
          <button
            onClick={() => { playUiSound('action'); onDismiss(); }}
            title={`Return to games (or press ${panicKey})`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Resume Work ({panicKey})</span>
          </button>
        </div>
      </div>

      {/* Realistic Document Paper Body */}
      <div className="flex-1 bg-[#f1f3f4] overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-3xl bg-white min-h-[900px] shadow-sm border border-gray-300 rounded p-12 text-sm leading-relaxed text-gray-800 font-serif">
          <h1 className="text-2xl font-bold font-sans text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Chapter 4: Principles of Cellular Respiration & ATP Synthesis
          </h1>

          <p className="mb-4">
            Cellular respiration is a series of chemical reactions that break down glucose to produce ATP, which can be used as energy to power the cell throughout its physiological processes. The catabolism of glucose into water and carbon dioxide involves three central stages: glycolysis, the citric acid (Krebs) cycle, and oxidative phosphorylation.
          </p>

          <h2 className="text-lg font-semibold font-sans text-gray-900 mt-6 mb-2">
            1. Glycolysis Overview
          </h2>
          <p className="mb-3">
            Glycolysis occurs in the cytoplasm of the cell and does not require oxygen (anaerobic). During this pathway, a single 6-carbon glucose molecule is cleaved into two 3-carbon molecules of pyruvate, generating a net gain of 2 ATP and 2 NADH molecules per glucose input.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
            <li>Substrate-level phosphorylation yields initial high-energy phosphate bonds.</li>
            <li>Enzyme Hexokinase catalyzes the primary phosphorylation of hexose substrates.</li>
            <li>Phosphofructokinase acts as the principal rate-limiting regulatory valve.</li>
          </ul>

          <h2 className="text-lg font-semibold font-sans text-gray-900 mt-6 mb-2">
            2. The Citric Acid Cycle & Electron Transport Chain
          </h2>
          <p className="mb-3">
            Pyruvate enters the mitochondrial matrix via active transport where it is oxidized to Acetyl-CoA. Through subsequent catalytic steps involving citrate synthase and alpha-ketoglutarate dehydrogenase, electrons are transferred to NAD+ and FAD coenzymes.
          </p>

          <div className="bg-gray-50 border border-gray-200 p-4 rounded my-6 font-sans text-xs text-gray-600">
            <strong>Key Formula:</strong> C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + approximately 30-32 ATP (under optimal eukaryotic aerobic efficiency).
          </div>

          <p className="text-gray-500 text-xs italic mt-8 border-t border-gray-200 pt-4 font-sans">
            Lecture notes drafted by Academic Research Group · Last modified 10 minutes ago
          </p>
        </div>
      </div>
    </div>
  );
};
