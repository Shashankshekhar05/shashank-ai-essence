import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Database, Globe2, Monitor, UserRound, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { visualProjects, type FlowNode, type ProjectFlow, type VisualProject } from "@/data/new-projects";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

const zones = {
  local: { label: "Application / local infrastructure", icon: Database },
  external: { label: "External service", icon: Globe2 },
  browser: { label: "Candidate browser", icon: Monitor },
  human: { label: "Human-owned", icon: UserRound },
};

export function TokenSaverCaseStudySection() {
  const project = visualProjects.find((item) => item.id === "tokensaver");
  const firstFlow = project?.flows[0];
  if (!project || !firstFlow) return null;

  return (
    <section
      id="tokensaver-case-study"
      className="scroll-mt-24 border-t border-border bg-background py-24 md:py-32"
    >
      <div className="shell">
        <Reveal>
          <p className="eyebrow">Personal project · architecture study</p>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight font-semibold md:text-[2.5rem]">
            {project.name}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {project.tagline} {project.problem}
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          <Tabs defaultValue={firstFlow.id}>
            <TabsList aria-label="TokenSaver RAG architecture flows" className="h-auto w-full flex-wrap justify-start gap-1 sm:w-auto">
              {project.flows.map((flow) => (
                <TabsTrigger key={flow.id} value={flow.id}>
                  {flow.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {project.flows.map((flow) => (
              <TabsContent key={flow.id} value={flow.id} className="mt-5">
                <FlowDiagram flow={flow} />
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>

        <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
          <FactList title="Key engineering decisions" items={project.decisions} />
          <FactList title="Reliability & safeguards" items={project.safeguards} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-7">
          <div className="flex flex-wrap gap-2">
            {project.stack.flatMap((group) => group.items).map((item) => (
              <span
                key={item}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              View source on GitHub <ArrowUpRight aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function NewProjectShowcases() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {visualProjects.map((project, index) => (
        <Reveal key={project.id} delay={index * 100}>
          <article id={project.id} className="card-lift flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-hairline bg-surface px-6 py-7 text-surface-foreground sm:px-8">
              <p className="eyebrow-invert">Personal project · architecture study</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal">{project.name}</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-surface-foreground/70">{project.tagline}</p>
              <PreviewDiagram project={project} />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground">{project.problem}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(project.id === "tokensaver" ? ["Local embeddings", "Two-level cache", "Async fallback"] : ["Adaptive voice", "Browser-side vision", "Recruiter decision"]).map((label) => (
                  <span key={label} className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground">{label}</span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                <ProjectCaseStudyButton project={project} />
                <Button asChild variant="link" size="sm" className="px-0">
                  <a href={project.href} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight aria-hidden /></a>
                </Button>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

function PreviewDiagram({ project }: { project: VisualProject }) {
  const labels = project.id === "tokensaver"
    ? ["Local retrieval", "Grok generation", "Grounded answer"]
    : ["Resume alignment", "Voice + edge AI", "Recruiter review"];
  return (
    <div className="mt-7 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2" aria-label={`${project.name} architecture overview`}>
      {labels.map((label, index) => (
        <div key={label} className="contents">
          {index > 0 && <ArrowRight aria-hidden className="size-3.5 text-signal" />}
          <div className="flex min-h-20 min-w-0 flex-col justify-center rounded-lg border border-hairline bg-surface-foreground/5 p-2.5">
            <span className="font-mono text-[10px] text-signal">0{index + 1}</span>
            <span className="mt-1 text-xs leading-snug">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectCaseStudyButton({ project }: { project: VisualProject }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Workflow aria-hidden /> Explore architecture</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-6xl overflow-y-auto rounded-2xl p-5 sm:p-8">
        {open && <CaseStudy project={project} />}
      </DialogContent>
    </Dialog>
  );
}

function CaseStudy({ project }: { project: VisualProject }) {
  const firstFlow = project.flows[0];
  if (!firstFlow) return null;
  return (
    <div>
      <header className="pr-6">
        <p className="eyebrow">Personal project · technical case study</p>
        <DialogTitle className="mt-3 text-3xl font-semibold tracking-normal">{project.name}</DialogTitle>
        <DialogDescription className="mt-3 max-w-3xl text-sm leading-relaxed">{project.tagline}</DialogDescription>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed"><span className="font-semibold">Problem. </span>{project.problem}</p>
      </header>

      <section className="mt-8" aria-label={`${project.name} architecture`}>
        <Tabs defaultValue={firstFlow.id}>
          <TabsList aria-label="Architecture flows" className="h-auto w-full flex-wrap justify-start gap-1 sm:w-auto">
            {project.flows.map((flow) => <TabsTrigger key={flow.id} value={flow.id}>{flow.label}</TabsTrigger>)}
          </TabsList>
          {project.flows.map((flow) => (
            <TabsContent key={flow.id} value={flow.id} className="mt-5">
              <FlowDiagram flow={flow} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <div className="mt-8 grid gap-8 border-t border-border pt-7 md:grid-cols-2">
        <FactList title="Key engineering decisions" items={project.decisions} />
        <FactList title="Reliability & safeguards" items={project.safeguards} />
      </div>
      <section className="mt-8 border-t border-border pt-7" aria-label="Project stack">
        <h3 className="eyebrow">Stack by subsystem</h3>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2">
          {project.stack.map((group) => (
            <div key={group.label}>
              <dt className="text-sm font-semibold">{group.label}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">{group.items.map((item) => <span key={item} className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground">{item}</span>)}</dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="mt-8 border-t border-border pt-7">
        <FactList title="Scope & limitations" items={project.limitations} />
        <Button asChild variant="outline" size="sm" className="mt-5"><a href={project.href} target="_blank" rel="noopener noreferrer">View source on GitHub <ArrowUpRight aria-hidden /></a></Button>
      </div>
    </div>
  );
}

function FlowDiagram({ flow }: { flow: ProjectFlow }) {
  const [selectedId, setSelectedId] = useState(flow.nodes[0]?.id ?? "");
  const allNodes = [...flow.nodes, ...flow.branches.flatMap((branch) => branch.nodes)];
  const selected = allNodes.find((node) => node.id === selectedId);
  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{flow.summary}</p>
      <div className="rounded-lg border border-hairline bg-surface p-4 text-surface-foreground sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
          <p className="eyebrow-invert">{flow.label} / request path</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Diagram legend">
            {Object.entries(zones).filter(([key]) => allNodes.some((node) => node.zone === key)).map(([key, zone]) => (
              <span key={key} className="inline-flex items-center gap-1.5 text-[10px] text-surface-foreground/65"><zone.icon aria-hidden className="size-3" />{zone.label}</span>
            ))}
          </div>
        </div>
        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.65fr)]">
          <ol className="min-w-0" aria-label={`${flow.label} flow stages`}>
            {flow.nodes.map((node, index) => {
              const branches = flow.branches.filter((branch) => branch.after === node.id);
              return (
                <li key={node.id}>
                  {index > 0 && <div className="flex items-center gap-2 py-2 pl-5"><ArrowDown aria-hidden className="size-4 text-signal" /><span className="font-mono text-[10px] text-surface-foreground/45">{flow.id === "query" && (node.id === "semantic" || node.id === "retrieve") ? "cache miss" : "continue"}</span></div>}
                  <NodeButton node={node} active={selectedId === node.id} onClick={() => setSelectedId(node.id)} index={index + 1} />
                  {branches.map((branch) => (
                    <div key={branch.label} className="ml-5 mt-3 border-l border-dashed border-signal/50 pb-2 pl-4">
                      <p className="mb-2 flex items-center gap-2 text-[11px] leading-relaxed text-signal"><ArrowRight aria-hidden className="size-3 shrink-0" />{branch.label}</p>
                      {branch.nodes.map((branchNode) => <NodeButton key={branchNode.id} node={branchNode} active={selectedId === branchNode.id} onClick={() => setSelectedId(branchNode.id)} />)}
                      <p className="mt-2 text-[11px] leading-relaxed text-surface-foreground/55">{branch.outcome}</p>
                    </div>
                  ))}
                </li>
              );
            })}
          </ol>
          <aside className="lg:sticky lg:top-0" aria-live="polite" aria-label="Selected stage details">
            {selected && <>
              <p className="eyebrow-invert">Stage detail</p>
              <h4 className="mt-3 text-xl font-semibold tracking-normal">{selected.label}</h4>
              <p className="mt-2 font-mono text-[11px] text-signal">{selected.tech}</p>
              <p className="mt-4 text-sm leading-relaxed text-surface-foreground/75">{selected.detail}</p>
              <div className="mt-5 flex items-center gap-2 border-t border-hairline pt-4 text-xs text-surface-foreground/55">
                {(() => { const Icon = zones[selected.zone].icon; return <Icon aria-hidden className="size-4 shrink-0" />; })()}
                {zones[selected.zone].label}
              </div>
            </>}
            <p className="mt-6 text-xs leading-relaxed text-surface-foreground/55">{flow.note}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function NodeButton({ node, active, onClick, index }: { node: FlowNode; active: boolean; onClick: () => void; index?: number }) {
  const Icon = zones[node.zone].icon;
  return (
    <Button variant="ghost" onClick={onClick} aria-pressed={active} className={cn(
      "h-auto min-h-16 w-full justify-start whitespace-normal rounded-lg border px-3 py-3 text-left hover:bg-surface-foreground/10 hover:text-surface-foreground",
      active ? "border-signal bg-signal/10" : "border-hairline bg-surface-foreground/5",
      node.zone === "external" && "border-dashed",
    )}>
      <span className="flex w-full min-w-0 items-start gap-3">
        <Icon aria-hidden className="mt-1 size-4 shrink-0 text-signal" />
        <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold">{node.label}</span><span className="mt-1 block break-words font-mono text-[10px] leading-relaxed text-surface-foreground/55">{node.tech}</span></span>
        {index !== undefined && <span className="font-mono text-[10px] text-surface-foreground/35">{String(index).padStart(2, "0")}</span>}
      </span>
    </Button>
  );
}

function FactList({ title, items }: { title: string; items: string[] }) {
  return <section><h3 className="eyebrow">{title}</h3><ul className="mt-4 space-y-3 text-[13px] leading-relaxed text-muted-foreground">{items.map((item) => <li key={item} className="flex gap-2"><span aria-hidden className="text-signal">—</span><span>{item}</span></li>)}</ul></section>;
}