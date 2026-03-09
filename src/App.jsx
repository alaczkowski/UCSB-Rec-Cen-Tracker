import { useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'

const siteUrl = 'https://ucsb-rec-cen-tracker.vercel.app'

const hourlyData = [
  { time: '6 AM', level: 10 },
  { time: '7 AM', level: 18 },
  { time: '8 AM', level: 32 },
  { time: '9 AM', level: 58 },
  { time: '10 AM', level: 70 },
  { time: '11 AM', level: 56 },
  { time: '12 PM', level: 49 },
  { time: '1 PM', level: 38 },
  { time: '2 PM', level: 43 },
  { time: '3 PM', level: 28 },
  { time: '4 PM', level: 34 },
  { time: '5 PM', level: 62 },
  { time: '6 PM', level: 68 },
  { time: '7 PM', level: 74 },
  { time: '8 PM', level: 80 },
  { time: '9 PM', level: 57 },
  { time: '10 PM', level: 35 },
  { time: '11 PM', level: 16 },
]

const weekdayMorning = [
  { time: '9:00 AM', percent: 28 },
  { time: '9:30 AM', percent: 36 },
  { time: '10:00 AM', percent: 32 },
  { time: '12:00 PM', percent: 28 },
]

const weekdayEvening = [
  { time: '6:00 PM', percent: 35 },
  { time: '7:30 PM', percent: 20 },
  { time: '8:00 PM', percent: 45 },
  { time: '9:00 PM', percent: 35 },
]

const fridayPattern = [
  { time: '10:00 AM', percent: 41.7 },
  { time: '2:00 PM', percent: 38.9 },
  { time: '5:30 PM', percent: 64.7 },
  { time: '6:30 PM', percent: 41.2 },
]

const weekendPattern = [
  { time: '9:00 AM', percent: 47.8 },
  { time: '10:00 AM', percent: 39.1 },
  { time: '12:30 PM', percent: 45 },
  { time: '8:00 PM', percent: 33.3 },
]

const takeaways = [
  'Least busy hours are usually early morning, mid-afternoon, and later at night.',
  'Weekday late mornings and 6:30-8:30 PM are the highest-traffic windows.',
  'Friday gets crowded earlier in the evening than the rest of the week.',
  'Weekend mornings are especially busy, especially around 9:00-10:30 AM.',
]

function getBarColor(value) {
  if (value <= 25) return '#22c55e'
  if (value <= 55) return '#eab308'
  return '#ef4444'
}

function getCrowdStatus(count) {
  if (count <= 5) {
    return { label: 'Empty', emoji: '🟢', helper: 'Very light live check-in activity.' }
  }
  if (count <= 15) {
    return { label: 'Moderate', emoji: '🟡', helper: 'Some live traffic is being reported.' }
  }
  return { label: 'Packed', emoji: '🔴', helper: 'Heavy live activity is being reported.' }
}

function formatTooltipValue(value, name) {
  return name === 'level' ? [`${value} / 100`, 'Crowd level'] : [`${value}%`, 'Responses']
}

export default function App() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkInCount, setCheckInCount] = useState(0)

  const crowdStatus = useMemo(() => getCrowdStatus(checkInCount), [checkInCount])

  function handleCheckIn() {
    if (checkedIn) return
    setCheckedIn(true)
    setCheckInCount((prev) => prev + 1)
  }

  function handleCheckOut() {
    if (!checkedIn) return
    setCheckedIn(false)
    setCheckInCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="page-shell">
      <header className="hero-card">
        <div className="hero-copy">
          <div className="brand-row">
            <div className="logo-mark">RC</div>
            <div>
              <div className="brand-name">Rec Cen Tracker</div>
              <div className="brand-subtitle">UCSB crowd timing insights</div>
            </div>
          </div>

          <h1>A better way to avoid crowded Rec Cen hours</h1>
          <p className="lede">
            Rec Cen Tracker helps UCSB students quickly see the busiest and least busy hours at the
            Recreation Center using survey-based crowd patterns and simple live check-in signals.
          </p>

          <div className="quick-grid">
            <InfoPill title="Best time today" value="3:00 PM - 4:30 PM" />
            <InfoPill title="Peak crowd hours" value="9:30 AM - 10:30 AM" secondary="6:30 PM - 8:30 PM" />
          </div>
        </div>

        <aside className="hero-side">
          <div className="qr-card">
            <QRCodeSVG value={siteUrl} size={124} bgColor="#ffffff" fgColor="#0f172a" />
            <p>Scan to open the tracker on your phone.</p>
          </div>

          <div className="live-card">
            <div className="eyebrow">Live check-ins</div>
            <div className="live-count">{checkInCount}</div>
            <div className="crowd-status">
              <span className="crowd-emoji">{crowdStatus.emoji}</span>
              <span>{crowdStatus.label}</span>
            </div>
            <p className="muted-text">{crowdStatus.helper}</p>

            <div className="button-row">
              <button className="primary-btn" onClick={handleCheckIn}>
                Check In
              </button>
              <button className="secondary-btn" onClick={handleCheckOut}>
                Check Out
              </button>
            </div>

            <p className="tiny-note">
              Demo note: this version resets when the page reloads. A database can be added later for
              shared real-time tracking.
            </p>
          </div>
        </aside>
      </header>

      <section className="section-card">
        <div className="section-header">
          <div>
            <div className="eyebrow dark">Main crowd guide</div>
            <h2>Estimated crowd level by hour</h2>
            <p>
              The higher the bar, the busier the Rec Cen is likely to feel. Green bars are better for
              avoiding crowds, yellow means moderate, and red means peak traffic.
            </p>
          </div>
          <div className="legend-box">
            <div>🟢 Empty / light</div>
            <div>🟡 Moderate</div>
            <div>🔴 Packed</div>
          </div>
        </div>

        <div className="chart-card large">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" interval={0} angle={-35} textAnchor="end" height={65} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={formatTooltipValue} />
              <Bar dataKey="level" radius={[8, 8, 0, 0]}>
                {hourlyData.map((entry) => (
                  <Cell key={entry.time} fill={getBarColor(entry.level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="insight-grid">
        <ChartBlock
          title="Mon-Thu morning"
          subtitle="Late morning is the main weekday morning rush."
          data={weekdayMorning}
        />
        <ChartBlock
          title="Mon-Thu evening"
          subtitle="8:00 PM is the clearest weekday evening peak."
          data={weekdayEvening}
        />
        <ChartBlock
          title="Friday pattern"
          subtitle="Friday gets crowded earlier in the evening."
          data={fridayPattern}
        />
        <ChartBlock
          title="Weekend pattern"
          subtitle="Weekend mornings are busier than weekend evenings."
          data={weekendPattern}
        />
      </section>

      <section className="section-card takeaway-card">
        <div className="eyebrow dark">What students should know</div>
        <h2>Fast takeaways</h2>
        <div className="takeaway-grid">
          {takeaways.map((item) => (
            <div key={item} className="takeaway-item">
              {item}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer-note">
        Built by UCSB students to help Gauchos plan smarter workouts.
      </footer>
    </div>
  )
}

function InfoPill({ title, value, secondary }) {
  return (
    <div className="info-pill">
      <div className="pill-title">{title}</div>
      <div className="pill-value">{value}</div>
      {secondary ? <div className="pill-secondary">{secondary}</div> : null}
    </div>
  )
}

function ChartBlock({ title, subtitle, data }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" interval={0} angle={-20} textAnchor="end" height={55} />
          <YAxis />
          <Tooltip formatter={formatTooltipValue} />
          <Bar dataKey="percent" fill="#0f172a" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
