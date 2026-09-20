import React, { useState } from 'react';
import { WindowCard } from '../components/ui/WindowCard';
import { Terminal, BookOpen, Code, AlertTriangle, FileText } from 'lucide-react';

export const Documentation: React.FC = () => {
    const [activeSection, setActiveSection] = useState('intro');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section className="min-h-screen bg-[var(--color-background)] py-16">
            <div className="container-constrained">
                {/* SIDE-BY-SIDE LAYOUT: 1/3 Sidebar + 2/3 Content */}
                <div className="flex flex-row gap-8">

                    {/* Sidebar Navigation - LEFT (1/3) - STICKY */}
                    <aside className="w-1/3">
                        <div className="sticky top-20 space-y-6">
                            <WindowCard title="nav.map" className="shadow-sm">
                                <nav className="flex flex-col space-y-1 font-mono text-sm">
                                    {[
                                        { id: 'intro', label: 'Introduction', icon: BookOpen },
                                        { id: 'install', label: 'Installation', icon: Terminal },
                                        { id: 'syntax', label: 'Syntax & Commands', icon: Code },
                                        { id: 'structure', label: 'Script Structure', icon: FileText },
                                        { id: 'troubleshoot', label: 'Troubleshooting', icon: AlertTriangle },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`flex items-center gap-3 px-3 py-2 text-left transition-all border-l-4 ${activeSection === item.id
                                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 font-bold text-[var(--color-text-primary)]'
                                                : 'border-transparent hover:bg-[var(--color-border)] hover:border-[var(--color-border)] text-[var(--color-text-secondary)]'
                                            }`}
                                        >
                                            <item.icon size={16} className="text-[var(--color-text-muted)]" />
                                            {item.label}
                                        </button>
                                    ))}
                                </nav>
                            </WindowCard>

                            <div className="border border-[var(--color-warning)] p-4 shadow-sm bg-[var(--color-warning)]/5 rounded-md">
                                <p className="font-mono text-xs font-bold mb-2 text-[var(--color-warning)]">💡 NEED HELP?</p>
                                <p className="font-sans text-sm text-[var(--color-text-secondary)] mb-3">
                                    If you encounter a bug or unexpected syntax error, please report it immediately on GitHub.
                                </p>
                                <a
                                    href="https://github.com/dhiyo7/heimdall/issues"
                                    target="_blank"
                                    className="block text-center border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-bold py-2 hover:bg-[var(--color-border)] transition-colors"
                                >
                                    OPEN ISSUE
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - RIGHT (2/3) - SCROLLABLE */}
                    <main className="w-2/3 min-w-0 pb-32">

                        {/* ===== SECTION 1: INTRODUCTION ===== */}
                        <section id="intro" className="scroll-mt-24">
                            <h1 className="font-sans font-black text-4xl mb-8">Complete Documentation</h1>
                            <div className="mb-12">
                                <WindowCard title="readme.txt" className="shadow-sm">
                                    <div className="prose max-w-none font-mono text-sm leading-relaxed">
                                        <p className="mb-4">
                                            <strong>Heimdall</strong> is a Keyword Driven Testing automation framework designed specifically for QA Engineers who want to avoid the complexity of writing manual driver code.
                                        </p>
                                        <p>
                                            Its core philosophy: <em>"Write like a human, test like a robot"</em>. You write scenarios in plain English that even a Project Manager can understand, and Heimdall translates them into Android actions via <code>uiautomator2</code>.
                                        </p>
                                    </div>
                                </WindowCard>
                            </div>
                        </section>

                        {/* ===== SECTION 2: INSTALLATION ===== */}
                        <section id="install" className="scroll-mt-24 mt-32">
                            <h2 className="font-sans font-black text-3xl mb-8 flex items-center gap-3">
                                <Terminal className="border-2 border-[var(--color-border)] p-1 rounded bg-[var(--color-background)] shadow-sm" size={32} />
                                Installation Guide (Step-by-Step)
                            </h2>

                            <div className="mb-12">
                                <WindowCard title="setup_guide.sh" date="STEP-BY-STEP" className="shadow-sm">
                                    <div className="space-y-8 font-mono text-sm">

                                        <div>
                                            <h3 className="font-bold text-lg mb-3 bg-[var(--color-text-primary)] text-white inline-block px-2">1. System Requirements</h3>
                                            <ul className="list-disc space-y-2 mt-4 pl-16">
                                                <li>Python 3.10 or newer.</li>
                                                <li>ADB (Android Debug Bridge) installed and registered in PATH.</li>
                                                <li>
                                                    <strong>Graphviz</strong> (Required for Mindmap).
                                                    <br /><span className="text-xs text-[var(--color-text-muted)]">Windows: Check "Add to PATH" during install. Mac: `brew install graphviz`.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg mb-3 bg-[var(--color-text-primary)] text-white inline-block px-2">2. Install Library</h3>
                                            <div className="bg-[var(--color-text-primary)] text-white p-4 rounded border-2 border-[var(--color-text-primary)] shadow-sm mt-4">
                                                <code>pip install -r requirements.txt</code>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg mb-3 bg-[var(--color-text-primary)] text-white inline-block px-2">3. Initialize Phone</h3>
                                            <p className="mb-3">Connect your Android phone, enable USB Debugging, then run:</p>
                                            <div className="bg-[var(--color-text-primary)] text-white p-4 rounded border-2 border-[var(--color-text-primary)] shadow-sm">
                                                <code>python -m uiautomator2 init</code>
                                            </div>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-4">*Grant ATX app installation permission on your phone screen.</p>
                                        </div>

                                    </div>
                                </WindowCard>
                            </div>
                        </section>

                        {/* ===== SECTION 3: SYNTAX ===== */}
                        <section id="syntax" className="scroll-mt-24 mt-32">
                            <h2 className="font-sans font-black text-3xl mb-8 flex items-center gap-3">
                                <Code className="border-2 border-[var(--color-border)] p-1 rounded bg-[var(--color-background)] shadow-sm" size={32} />
                                Syntax Dictionary (Cheatsheet)
                            </h2>

                            <p className="mb-6 font-mono text-sm text-[var(--color-text-muted)]">
                                Use the following commands in your <code>.heim</code> files. Case insensitive.
                            </p>

                            <div className="overflow-x-auto border-2 border-[var(--color-border)] shadow-sm mb-12">
                                <table className="w-full text-left font-mono text-sm bg-[var(--color-surface-muted)]">
                                    <thead className="bg-[var(--color-text-primary)] text-white">
                                        <tr>
                                            <th className="p-4 border-r border-[var(--color-border)]">Keyword</th>
                                            <th className="p-4 border-r border-[var(--color-border)]">Parameter</th>
                                            <th className="p-4">Function & Example</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-border)]">
                                        {/* Open */}
                                        <tr className="hover:bg-[var(--color-background)]">
                                            <td className="p-4 font-bold text-[var(--color-primary)] align-top">Open</td>
                                            <td className="p-4 align-top">Package Name</td>
                                            <td className="p-4">
                                                Opens the target application.
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Open app "com.gojek.app"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Type Label */}
                                        <tr className="hover:bg-[var(--color-background)]">
                                            <td className="p-4 font-bold text-[var(--color-secondary)] align-top">Type</td>
                                            <td className="p-4 align-top">"Text" on "Label"</td>
                                            <td className="p-4">
                                                Fills form input that has a specific label/placeholder.
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Type "user123" on column "Username"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Type Ordinal */}
                                        <tr className="hover:bg-[var(--color-accent)]/10">
                                            <td className="p-4 font-bold text-[var(--color-secondary)] align-top">Type <span className="text-[10px] bg-[var(--color-text-primary)] text-white px-1">ORDINAL</span></td>
                                            <td className="p-4 align-top">"Text" on "ordinal X"</td>
                                            <td className="p-4">
                                                <strong>Power Move!</strong> Fills form based on element index position (starting from 1) if the label is not detected.
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Type "secret" on column "ordinal 2"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Tap */}
                                        <tr className="hover:bg-[var(--color-background)]">
                                            <td className="p-4 font-bold text-[var(--color-success)] align-top">Tap</td>
                                            <td className="p-4 align-top">"Button Text"</td>
                                            <td className="p-4">
                                                Presses button/element containing the given text.
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Tap button "Login"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Tap FAB */}
                                        <tr className="hover:bg-[var(--color-accent)]/10">
                                            <td className="p-4 font-bold text-[var(--color-success)] align-top">Tap <span className="text-[10px] bg-[var(--color-text-primary)] text-white px-1">FAB</span></td>
                                            <td className="p-4 align-top">button "FAB"</td>
                                            <td className="p-4">
                                                Presses the Floating Action Button (Bottom Right) using relative coordinates.
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Tap button "FAB"
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Wait */}
                                        <tr className="hover:bg-[var(--color-background)]">
                                            <td className="p-4 font-bold text-[var(--color-warning)] align-top">Wait</td>
                                            <td className="p-4 align-top">"Indicator Text"</td>
                                            <td className="p-4">
                                                Pause the script until certain text appears on screen (Handling Loading).
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Wait until text "Welcome" appears
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Assert */}
                                        <tr className="hover:bg-[var(--color-background)]">
                                            <td className="p-4 font-bold text-[var(--color-danger)] align-top">Assert</td>
                                            <td className="p-4 align-top">"Validation Text"</td>
                                            <td className="p-4">
                                                Assertion. The test will FAIL (Red) if this text is not found.
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Assert "Transaction Successful" appears
                                                </div>
                                            </td>
                                        </tr>
                                        {/* Scroll */}
                                        <tr className="hover:bg-[var(--color-background)]">
                                            <td className="p-4 font-bold text-[var(--color-text-muted)] align-top">Scroll</td>
                                            <td className="p-4 align-top">"Down" / "Up"</td>
                                            <td className="p-4">
                                                Manually scroll the screen.
                                                <div className="mt-2 bg-[var(--color-background)] p-2 text-xs border border-[var(--color-border)] rounded">
                                                    Scroll to "Down"
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* ===== SECTION 4: SCRIPT STRUCTURE ===== */}
                        <section id="structure" className="scroll-mt-24">
                            <h2 className="font-sans font-black text-3xl mb-6 flex items-center gap-3">
                                <FileText className="border-2 border-[var(--color-border)] p-1 rounded bg-[var(--color-background)] shadow-sm" size={32} />
                                Script Structure (.heim)
                            </h2>

                            <WindowCard title="login_scenario.heim" date="CODE" className="shadow-sm mb-12">
                                <div className="space-y-4">
                                    <p className="font-mono text-sm">Use tag <code className="bg-[var(--color-text-primary)] text-white px-1"># FEATURE: Name</code> to group steps in the Mindmap neatly.</p>

                                    <div className="bg-[var(--color-surface-muted)] p-6 rounded border-2 border-[var(--color-border)] shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2 opacity-50 font-mono text-xs text-[var(--color-text-muted)]">.heim</div>
                                        <pre className="font-mono text-sm text-[var(--color-text-secondary)] overflow-x-auto">
                                            {`# This is a comment (not executed)
# Title: Positive Login Scenario

# FEATURE: Open App
Open app "com.example.app"
Wait until text "Sign In" appears

# FEATURE: Input Data
Type "user@test.com" on column "Email"
Type "123456" on column "Password"
Tap button "Login"

# FEATURE: Validate Dashboard
# Wait for loading to complete
Wait until text "Hello User" appears
Assert "Balance" appears`}
                                        </pre>
                                    </div>
                                </div>
                            </WindowCard>
                        </section>

                        {/* ===== SECTION 5: TROUBLESHOOTING ===== */}
                        <section id="troubleshoot" className="scroll-mt-24">
                            <h2 className="font-sans font-black text-3xl mb-6 flex items-center gap-3">
                                <AlertTriangle className="border-2 border-[var(--color-border)] p-1 rounded bg-[var(--color-background)] shadow-sm" size={32} />
                                Troubleshooting
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border-2 border-[var(--color-danger)] p-6 bg-[var(--color-danger)]/5 shadow-sm">
                                    <h3 className="font-bold text-lg text-[var(--color-danger)] mb-2">Keyboard Not Appearing?</h3>
                                    <p className="font-mono text-sm text-[var(--color-text-secondary)] mb-4">
                                        Heimdall uses "Ghost Keyboard" (FastInputIME) for fast input. Side effect: the phone's default keyboard is hidden.
                                    </p>
                                    <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-3 rounded text-xs font-mono">
                                        <strong>Solution:</strong> Run a dummy script again until it finishes, or disable via ADB:
                                        <br />
                                        <code>adb shell settings put secure default_input_method ...</code>
                                    </div>
                                </div>

                                <div className="border-2 border-[var(--color-primary)] p-6 bg-[var(--color-primary)]/5 shadow-sm">
                                    <h3 className="font-bold text-lg text-[var(--color-primary)] mb-2">Element Not Found?</h3>
                                    <p className="font-mono text-sm text-[var(--color-text-secondary)] mb-4">
                                        Sometimes Android UI labels differ from visible text (e.g. ImageView without content-desc).
                                    </p>
                                    <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] p-3 rounded text-xs font-mono">
                                        <strong>Solution:</strong> Use the command <code className="bg-[var(--color-primary)]/10 px-1">ordinal 1</code>, <code className="bg-[var(--color-primary)]/10 px-1">ordinal 2</code> etc. to target input columns by their screen position.
                                    </div>
                                </div>
                            </div>

                        </section>

                    </main>
                </div>
            </div>
        </section>
    );
};