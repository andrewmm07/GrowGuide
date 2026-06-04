import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type MonthDirection = "current" | "slate" | "flat" | "sections";
type SectionTab = "overview" | "plant" | "weekly";

interface DirectionMeta {
  id: MonthDirection;
  name: string;
  tagline: string;
  accentNote: string;
  bgNote: string;
}

const DIRECTIONS: DirectionMeta[] = [
  {
    id: "current",
    name: "Current (problems)",
    tagline: "Mixed scales, heavy cards, competing greens",
    accentNote: "green-600 + green-800 + emerald + slate-700",
    bgNote: "gray-50 + green-50 gradients per page",
  },
  {
    id: "slate",
    name: "A · Garden Slate",
    tagline: "Warm neutral base, one forest accent",
    accentNote: "#2D6A4F forest · used only for active + links",
    bgNote: "#F7F6F3 warm gray · flat, no gradients",
  },
  {
    id: "flat",
    name: "B · Clean Paper",
    tagline: "White surfaces, hairline borders, calm",
    accentNote: "#059669 emerald-600 · pills + nav only",
    bgNote: "#F3F4F6 · cards pure white",
  },
  {
    id: "sections",
    name: "C · Compact Pro",
    tagline: "List-first, dense, tool-like",
    accentNote: "#166534 green-800 · header bar only",
    bgNote: "#FAFAFA · rows not boxes",
  },
];

const MONTH = "May";
const SEASON = "Late autumn";
const LOCATION = "Hobart, TAS";
const SOW = ["Peas", "Broad beans", "Garlic", "Spinach"];
const PLANT = ["Strawberries", "Rhubarb"];

function PhoneFrame({
  label,
  children,
  width = 300,
}: {
  label: string;
  children: unknown;
  width?: number;
}) {
  const theme = useHostTheme();
  return (
    <Stack gap={6} style={{ alignItems: "center" }}>
      <Text size="small" weight="medium">
        {label}
      </Text>
      <div
        style={{
          width,
          height: 620,
          borderRadius: 24,
          border: `2px solid ${theme.stroke.secondary}`,
          background: theme.bg.editor,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </Stack>
  );
}

function Chrome({ accent }: { accent: string }) {
  const theme = useHostTheme();
  return (
    <>
      <Row
        justify="space-between"
        align="center"
        style={{
          padding: "8px 12px",
          borderBottom: `1px solid ${theme.stroke.tertiary}`,
          background: theme.bg.chrome,
        }}
      >
        <Text size="small" weight="medium">
          GrowGuide
        </Text>
        <Text size="small" tone="tertiary">
          bell
        </Text>
      </Row>
      <Row
        gap={0}
        style={{
          margin: "8px 10px 0",
          padding: 2,
          borderRadius: 8,
          background: theme.fill.tertiary,
        }}
      >
        {["This week", "This month", "Year"].map((item, i) => (
          <div
            key={item}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 10,
              fontWeight: i === 1 ? 600 : 500,
              padding: "7px 2px",
              borderRadius: 6,
              background: i === 1 ? theme.bg.elevated : "transparent",
              color: i === 1 ? accent : theme.text.secondary,
            }}
          >
            {item}
          </div>
        ))}
      </Row>
    </>
  );
}

function BottomNav({ accent }: { accent: string }) {
  const theme = useHostTheme();
  const items = ["Home", "Garden", "Plan", "More"];
  return (
    <Row
      justify="space-around"
      style={{
        borderTop: `1px solid ${theme.stroke.tertiary}`,
        background: theme.bg.elevated,
        padding: "6px 0 10px",
      }}
    >
      {items.map((item, i) => {
        const active = i === 2;
        return (
          <Stack key={item} gap={2} style={{ alignItems: "center", flex: 1 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: active ? accent : theme.fill.tertiary,
              }}
            />
            <Text
              size="small"
              weight={active ? "medium" : "regular"}
              style={{ fontSize: 10, color: active ? accent : theme.text.tertiary }}
            >
              {item}
            </Text>
          </Stack>
        );
      })}
    </Row>
  );
}

function Chip({ label, tone }: { label: string; tone: "sow" | "plant" }) {
  const theme = useHostTheme();
  return (
    <span
      style={{
        fontSize: 11,
        padding: "4px 8px",
        borderRadius: 6,
        background: theme.fill.quaternary,
        border: `1px solid ${theme.stroke.tertiary}`,
        color: theme.text.secondary,
      }}
    >
      {label}
    </span>
  );
}

function CurrentMonthBody() {
  const theme = useHostTheme();
  const accent = "#16a34a";
  return (
    <>
      <div style={{ flex: 1, overflow: "auto", background: "#f0fdf4", padding: "10px 12px 8px" }}>
        <Text size="small" tone="tertiary" style={{ fontSize: 9, marginBottom: 6 }}>
          Page bg: green tint (current pattern)
        </Text>
        <Text style={{ fontSize: 11, fontWeight: 600, color: accent }}>MONTHLY GUIDE</Text>
        <Text style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{MONTH} growing guide</Text>
        <Text size="small" tone="secondary" style={{ marginBottom: 10 }}>
          {SEASON} · {LOCATION}
        </Text>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 10,
            border: "1px solid #e5e7eb",
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase" }}>
            Summary
          </Text>
          <Text size="small" style={{ marginTop: 6, lineHeight: 1.4 }}>
            MonthGuidancePanel in p-6 card — then same info repeated in accordions below
          </Text>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ background: "#6b7280", borderRadius: "16px 16px 0 0", padding: "14px 12px" }}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Watch this month</Text>
            <Text size="small" style={{ color: "#d1d5db", marginTop: 4 }}>
              CollapsiblePanel open: gray-500 header
            </Text>
          </div>
          <div
            style={{
              background: theme.bg.elevated,
              border: "1px solid #e5e7eb",
              borderTop: "none",
              borderRadius: "0 0 16px 16px",
              padding: 12,
            }}
          >
            <Text size="small" tone="secondary">
              Duplicate risks vs summary above
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ background: "#6b7280", borderRadius: "16px 16px 0 0", padding: "14px 12px" }}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Monthly Overview</Text>
          </div>
          <div
            style={{
              background: theme.bg.elevated,
              border: "1px solid #e5e7eb",
              borderTop: "none",
              borderRadius: "0 0 16px 16px",
              padding: 12,
            }}
          >
            <Text size="small" tone="secondary" style={{ marginBottom: 6 }}>
              Timeline pl-16 · gradient line · text-xl section heads
            </Text>
            <Text size="small" tone="secondary">
              Amber gradient Essential Tasks box · Weekly Plan W56 badges
            </Text>
          </div>
        </div>

        <div
          style={{
            background: theme.bg.elevated,
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: 10,
            opacity: 0.85,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 600 }}>Weekly Plan</Text>
          <Text size="small" tone="tertiary" style={{ marginTop: 4 }}>
            collapsed — opens to 3-column grid per week
          </Text>
        </div>
      </div>
      <BottomNav accent={accent} />
    </>
  );
}

function SlateMonthBody() {
  const theme = useHostTheme();
  const accent = "#2D6A4F";
  return (
    <>
      <div style={{ flex: 1, overflow: "auto", background: "#F7F6F3", padding: "10px 12px 8px" }}>
        <Row justify="space-between" align="start" style={{ marginBottom: 8 }}>
          <Stack gap={2}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: accent }}>{MONTH.toUpperCase()}</Text>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>
              {SEASON} · {LOCATION}
            </Text>
          </Stack>
          <Text size="small" style={{ fontSize: 11, color: accent }}>
            Change month
          </Text>
        </Row>

        <div
          style={{
            background: theme.bg.elevated,
            border: `1px solid ${theme.stroke.tertiary}`,
            borderRadius: 10,
            padding: 10,
            marginBottom: 8,
          }}
        >
          <Text size="small" style={{ lineHeight: 1.45 }}>
            Cool soil — focus on hardy greens and alliums. Hold tender seedlings until frost risk
            drops.
          </Text>
          <Grid columns={2} gap={6} style={{ marginTop: 8 }}>
            <div>
              <Text size="small" style={{ fontSize: 10, fontWeight: 600, color: accent }}>
                Do this month
              </Text>
              <Stack gap={2} style={{ marginTop: 4 }}>
                {["Mulch beds", "Direct sow peas", "Prune spent crops"].map((t) => (
                  <Text key={t} size="small" style={{ fontSize: 11 }}>
                    · {t}
                  </Text>
                ))}
              </Stack>
            </div>
            <div>
              <Text size="small" style={{ fontSize: 10, fontWeight: 600, color: "#b45309" }}>
                Watch
              </Text>
              <Stack gap={2} style={{ marginTop: 4 }}>
                {["Late frosts", "Waterlogging after rain"].map((t) => (
                  <Text key={t} size="small" style={{ fontSize: 11 }}>
                    · {t}
                  </Text>
                ))}
              </Stack>
            </div>
          </Grid>
        </div>

        <div style={{ marginBottom: 8 }}>
          <Text size="small" style={{ fontSize: 10, fontWeight: 600, color: theme.text.tertiary }}>
            SOW
          </Text>
          <Row gap={4} style={{ marginTop: 6, flexWrap: "wrap" }}>
            {SOW.map((s) => (
              <Chip key={s} label={s} tone="sow" />
            ))}
          </Row>
        </div>

        <div style={{ marginBottom: 8 }}>
          <Text size="small" style={{ fontSize: 10, fontWeight: 600, color: theme.text.tertiary }}>
            PLANT OUT
          </Text>
          <Row gap={4} style={{ marginTop: 6, flexWrap: "wrap" }}>
            {PLANT.map((p) => (
              <Chip key={p} label={p} tone="plant" />
            ))}
          </Row>
        </div>

        {["Weekly split", "Avoid this month"].map((row) => (
          <Row
            key={row}
            justify="space-between"
            style={{
              padding: "10px 0",
              borderTop: `1px solid ${theme.stroke.tertiary}`,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: 600 }}>{row}</Text>
            <Text size="small" tone="tertiary">
              ›
            </Text>
          </Row>
        ))}
      </div>
      <BottomNav accent={accent} />
    </>
  );
}

function FlatMonthBody() {
  const theme = useHostTheme();
  const accent = "#059669";
  return (
    <>
      <div style={{ flex: 1, overflow: "auto", background: "#F3F4F6", padding: "8px 10px" }}>
        <Text style={{ fontSize: 17, fontWeight: 700 }}>{MONTH}</Text>
        <Text size="small" tone="secondary" style={{ fontSize: 12, marginBottom: 10 }}>
          {SEASON} · {LOCATION}
        </Text>

        {[
          {
            title: "Overview",
            body: "Cool soil — hardy greens and alliums. Hold tender seedlings.",
          },
          { title: "Sow", body: SOW.join(", "), action: "+ add to garden" },
          { title: "Plant out", body: PLANT.join(", ") },
          { title: "Week 2 · 8–14 May", body: "Sow peas · Plant strawberries · Mulch beds" },
        ].map((block) => (
          <div
            key={block.title}
            style={{
              background: "#FFFFFF",
              border: `1px solid ${theme.stroke.tertiary}`,
              borderRadius: 8,
              padding: 12,
              marginBottom: 6,
            }}
          >
            <Row justify="space-between">
              <Text style={{ fontSize: 13, fontWeight: 600 }}>{block.title}</Text>
              {"action" in block && block.action ? (
                <Text size="small" style={{ fontSize: 10, color: accent }}>
                  {block.action}
                </Text>
              ) : null}
            </Row>
            <Text size="small" tone="secondary" style={{ fontSize: 12, marginTop: 4 }}>
              {block.body}
            </Text>
          </div>
        ))}
      </div>
      <BottomNav accent={accent} />
    </>
  );
}

function SectionsMonthBody({
  tab,
  onTab,
}: {
  tab: SectionTab;
  onTab: (t: SectionTab) => void;
}) {
  const theme = useHostTheme();
  const accent = "#166534";
  const tabs: { id: SectionTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "plant", label: "Sow & plant" },
    { id: "weekly", label: "Weekly" },
  ];

  return (
    <>
      <div
        style={{
          background: accent,
          color: "#fff",
          padding: "10px 12px 12px",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>GrowGuide · {MONTH}</Text>
        <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
          {LOCATION}
        </Text>
      </div>
      <div style={{ flex: 1, overflow: "auto", background: "#FAFAFA", display: "flex", flexDirection: "column" }}>
        <Row gap={0} style={{ borderBottom: `1px solid ${theme.stroke.tertiary}`, background: theme.bg.elevated }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTab(t.id)}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                padding: "8px 4px",
                fontSize: 11,
                fontWeight: tab === t.id ? 600 : 500,
                color: tab === t.id ? accent : theme.text.secondary,
                borderBottom: tab === t.id ? `2px solid ${accent}` : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </Row>
        <div style={{ padding: 10, flex: 1 }}>
          {tab === "overview" && (
            <Stack gap={4}>
              <Text size="small" style={{ lineHeight: 1.45 }}>
                Focus, watch, and avoid on one screen — no nested accordions.
              </Text>
              <Text size="small" tone="secondary">
                Do: mulch · sow peas · Watch: late frosts · Avoid: tender seedlings
              </Text>
            </Stack>
          )}
          {tab === "plant" && (
            <Row gap={4} style={{ flexWrap: "wrap" }}>
              {SOW.concat(PLANT).map((p) => (
                <Chip key={p} label={p} tone="sow" />
              ))}
            </Row>
          )}
          {tab === "weekly" && (
            <Stack gap={6}>
              {[
                "Week 1 — Sow broad beans",
                "Week 2 — Sow peas · Plant strawberries",
                "Week 3 — Garlic · Mulch",
                "Week 4 — Plan next month",
              ].map((w) => (
                <Text key={w} size="small" style={{ fontSize: 11 }}>
                  {w}
                </Text>
              ))}
            </Stack>
          )}
        </div>
      </div>
      <BottomNav accent={accent} />
    </>
  );
}

function MonthMock({
  direction,
  sectionTab,
  onSectionTab,
}: {
  direction: MonthDirection;
  sectionTab: SectionTab;
  onSectionTab: (t: SectionTab) => void;
}) {
  return (
    <>
      {direction !== "sections" && <Chrome accent={
        direction === "current" ? "#16a34a" : direction === "slate" ? "#2D6A4F" : direction === "flat" ? "#059669" : "#166534"
      } />}
      {direction === "current" && <CurrentMonthBody />}
      {direction === "slate" && <SlateMonthBody />}
      {direction === "flat" && <FlatMonthBody />}
      {direction === "sections" && (
        <SectionsMonthBody tab={sectionTab} onTab={onSectionTab} />
      )}
    </>
  );
}

function TypeScaleCompare() {
  const rows = [
    { role: "Page title (mobile)", current: "20–32px mixed", proposed: "17–18px fixed" },
    { role: "Card title", current: "14–18px + ALL CAPS", proposed: "13–14px semibold" },
    { role: "Eyebrow label", current: "xs uppercase green-600", proposed: "11px medium, one accent" },
    { role: "Body", current: "sm + base mixed", proposed: "12–13px regular" },
    { role: "Meta / caption", current: "10–11px gray-400/500", proposed: "10–11px tertiary only" },
    { role: "Card padding", current: "p-5 (20px) common", proposed: "p-3 (12px) mobile" },
    { role: "Corner radius", current: "rounded-2xl (16px)", proposed: "rounded-lg (8–10px)" },
  ];
  return (
    <Table
      columns={[
        { key: "role", header: "Token", width: "28%" },
        { key: "current", header: "Current month page", width: "36%" },
        { key: "proposed", header: "Proposed (A/B/C)", width: "36%" },
      ]}
      rows={rows.map((r) => ({
        role: r.role,
        current: r.current,
        proposed: r.proposed,
      }))}
    />
  );
}

export default function MonthViewUiCanvas() {
  const [selected, setSelected] = useCanvasState<MonthDirection>("monthDir", "slate");
  const [sectionTab, setSectionTab] = useCanvasState<SectionTab>("monthTab", "plant");

  const meta = DIRECTIONS.find((d) => d.id === selected) ?? DIRECTIONS[1];

  return (
    <Stack gap={16}>
      <Stack gap={6}>
        <H1>Plan → Month view UI review</H1>
        <Text tone="secondary">
          Focused on /planting-calendar/[month] — not the dashboard. Includes segment bar chrome
          (Week / Month / Year) as it appears on phone. Mockup only — not implemented in app.
        </Text>
      </Stack>

      <Callout tone="warning" title="Why the month page feels rough">
        <Stack gap={4}>
          <Text size="small">
            No shared design tokens on the month page — CollapsiblePanel, timeline layout, and weekly
            cards each pick their own sizes and colours.
          </Text>
        </Stack>
      </Callout>

      <Card>
        <CardHeader title="Current month page — specific issues" />
        <CardBody>
          <Table
            columns={[
              { key: "el", header: "Element", width: "28%" },
              { key: "problem", header: "Problem", width: "72%" },
            ]}
            rows={[
              {
                el: "CollapsiblePanel",
                problem:
                  "Open header bg-gray-500 + white text-2xl title · rounded-3xl · shadow-lg — reads like a bug",
              },
              {
                el: "Header stack",
                problem:
                  "App header + segment bar + PlanPageHeader eyebrow + long title + Months button = ~120px before content",
              },
              {
                el: "Summary + panels",
                problem:
                  "MonthGuidancePanel in p-6 card, then Watch / Overview / Weekly repeat same risks & sow lists",
              },
              {
                el: "Sow / plant timeline",
                problem:
                  "pl-16 timeline, gradient line, text-xl section heads, shadow dots — huge on 360px width",
              },
              {
                el: "Essential tasks",
                problem: "amber gradient box inside accordion — third colour system",
              },
              {
                el: "Weekly plan",
                problem:
                  "Each week = full card, W badge 56px, 3-col grid, status pills green/blue/gray · space-y-12",
              },
              {
                el: "No-nos",
                problem: "red gradient columns, text-lg headings — rarely opened but heavy",
              },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Proposed type & spacing scale (all options)" />
        <CardBody>
          <TypeScaleCompare />
        </CardBody>
      </Card>

      <Stack gap={8}>
        <H2>Pick a direction</H2>
        <Row gap={8} style={{ flexWrap: "wrap" }}>
          {DIRECTIONS.map((d) => (
            <Button
              key={d.id}
              variant={selected === d.id ? "primary" : "secondary"}
              onClick={() => setSelected(d.id)}
            >
              {d.name}
            </Button>
          ))}
        </Row>
        <Row gap={12} style={{ flexWrap: "wrap" }}>
          <Pill tone="neutral">Accent: {meta.accentNote}</Pill>
          <Pill tone="neutral">Background: {meta.bgNote}</Pill>
        </Row>
        <Text tone="secondary">{meta.tagline}</Text>
      </Stack>

      <Grid columns={2} gap={16}>
        <PhoneFrame label={`${meta.name} — month view`}>
          <MonthMock
            direction={selected}
            sectionTab={sectionTab}
            onSectionTab={setSectionTab}
          />
        </PhoneFrame>

        <Stack gap={12}>
          <H3>Recommendation notes</H3>
          {selected === "current" && (
            <Stack gap={8}>
              <Text size="small">
                The current month UI reads like several pages stitched together — website-era hero
                headings on a phone app with bottom tabs. Gradients and heavy shadows add visual
                noise without hierarchy.
              </Text>
              <Callout tone="info" title="Minimum fix (no full restructure)">
                Restyle CollapsiblePanel (no gray open state, 14px titles, rounded-lg). Use
                MonthGuidancePanel guide variant for summary. Remove timeline — use chip lists.
                Shrink weekly rows.
              </Callout>
            </Stack>
          )}
          {selected === "slate" && (
            <Stack gap={8}>
              <Text size="small" weight="medium">
                Best balance for GrowGuide
              </Text>
              <Text size="small" tone="secondary">
                Warm off-white feels garden-adjacent without literal green wallpaper. Forest accent
                (#2D6A4F) on nav, links, and eyebrows only. Cards stay flat with 1px borders.
                Keeps personality while fixing scale.
              </Text>
              <Text size="small" tone="secondary">
                Implementation later: extend tailwind.config.js with gg-* tokens, one Card primitive,
                shrink mobile padding globally.
              </Text>
            </Stack>
          )}
          {selected === "flat" && (
            <Stack gap={8}>
              <Text size="small" weight="medium">
                Safest / most neutral
              </Text>
              <Text size="small" tone="secondary">
                Pure white cards on cool gray — closest to Apple Weather / Notes apps. Lowest risk
                if you want a clean app fast. Less distinctive brand; green appears only on
                interactive elements.
              </Text>
            </Stack>
          )}
          {selected === "sections" && (
            <Stack gap={8}>
              <Text size="small" weight="medium">
                Maximum information density
              </Text>
              <Text size="small" tone="secondary">
                Drops card stacks for tappable rows — good if users live in weekly brief and task
                lists. Coloured header bar gives app identity. Harder migration (layout changes per
                screen).
              </Text>
              <Text size="small" tone="secondary">
                Tap Overview / Sow & plant / Weekly tabs in the C phone mock to preview.
              </Text>
            </Stack>
          )}

          <Divider />

          <H3>All three agree on</H3>
          <Stack gap={4}>
            <Text size="small">· One page title size on mobile (17–18px)</Text>
            <Text size="small">· One card padding (12px) and radius (8–10px)</Text>
            <Text size="small">· Remove page-level gradients — use MainLayout bg only</Text>
            <Text size="small">· One accent green, neutrals for everything else</Text>
            <Text size="small">· Replace emoji nav icons with SVG (More sheet)</Text>
          </Stack>
        </Stack>
      </Grid>

      <Grid columns={3} gap={12}>
        <PhoneFrame label="A · Garden Slate" width={260}>
          <MonthMock direction="slate" sectionTab="plant" onSectionTab={() => {}} />
        </PhoneFrame>
        <PhoneFrame label="B · Clean Paper" width={260}>
          <MonthMock direction="flat" sectionTab="plant" onSectionTab={() => {}} />
        </PhoneFrame>
        <PhoneFrame label="C · In-page tabs" width={260}>
          <MonthMock
            direction="sections"
            sectionTab={sectionTab}
            onSectionTab={setSectionTab}
          />
        </PhoneFrame>
      </Grid>
    </Stack>
  );
}
