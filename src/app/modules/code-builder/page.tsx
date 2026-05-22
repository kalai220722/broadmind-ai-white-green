"use client";

import ModuleLayout from "@/components/modules/ModuleLayout";
import { Play, RotateCcw, Download, Settings, Check, X, Terminal, FileCode } from "lucide-react";
import { useState } from "react";

const languages = ["Python", "JavaScript", "C++", "Java", "Go", "Rust", "TypeScript", "C"];
const sampleCode = `# Binary Search Implementation
def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# Test
arr = [2, 3, 4, 10, 40, 50, 60]
result = binary_search(arr, 10)
print(f"Element found at index: {result}")`;

const output = `Element found at index: 3

✓ All test cases passed (4/4)
  ✓ Basic search: PASS
  ✓ First element: PASS
  ✓ Last element: PASS
  ✓ Not found: PASS`;

export default function CodeBuilderPage() {
  const [lang, setLang] = useState("Python");
  const [showOutput, setShowOutput] = useState(true);

  return (
    <ModuleLayout moduleId="code-builder">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Code editor */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center gap-3">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-slate-800 text-sm text-white border border-slate-700 rounded-md px-2 py-1 outline-none"
              >
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <span className="text-xs text-slate-500">binary_search.py</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Reset">
                <RotateCcw size={14} />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Download">
                <Download size={14} />
              </button>
              <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Settings">
                <Settings size={14} />
              </button>
              <button
                onClick={() => setShowOutput(!showOutput)}
                className="flex items-center gap-1.5 ml-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-md transition-colors"
              >
                <Play size={12} />
                Run
              </button>
            </div>
          </div>

          {/* Editor area */}
          <div className="flex">
            <div className="flex-1">
              <pre className="p-4 text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
                <code>{sampleCode}</code>
              </pre>
            </div>
          </div>

          {/* Output panel */}
          {showOutput && (
            <div className="border-t border-slate-800">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400">Output</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400">Passed</span>
                </div>
              </div>
              <pre className="p-4 text-sm font-mono text-emerald-300 bg-slate-950/50 max-h-40 overflow-y-auto">
                {output}
              </pre>
            </div>
          )}
        </div>

        {/* Right panel - AI assistant */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="text-white font-semibold text-sm mb-3">AI Assistant</h3>
            <div className="space-y-2">
              {["Explain this code", "Find bugs", "Optimise", "Add tests", "Convert to Java"].map(
                (action) => (
                  <button
                    key={action}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 rounded-lg border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {action}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Test Results</h3>
            <div className="space-y-2">
              {[
                { name: "Basic search", pass: true },
                { name: "First element", pass: true },
                { name: "Last element", pass: true },
                { name: "Not found", pass: true },
              ].map((test) => (
                <div key={test.name} className="flex items-center gap-2 text-xs">
                  {test.pass ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <X size={14} className="text-red-400" />
                  )}
                  <span className={test.pass ? "text-slate-300" : "text-red-300"}>
                    {test.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Recent Files</h3>
            <div className="space-y-1.5">
              {[
                "binary_search.py",
                "linked_list.py",
                "sort_algorithms.py",
                "graph_bfs.cpp",
              ].map((file) => (
                <button
                  key={file}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                >
                  <FileCode size={12} />
                  {file}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}
