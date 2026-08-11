import { IconArrowUpRight, IconClock, IconFilter, IconPlus } from '@tabler/icons-react';
import Button from '../../global-components/Button/Button';
import './ModulePlaceholder.css';

const ModulePlaceholder = ({ title, description }) => (
  <section className="module-placeholder-page">
    <div className="module-placeholder-hero">
      <div>
        <span className="module-eyebrow">Workspace module</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="module-hero-actions">
        <Button variant="outline" icon={<IconFilter size={16} />}>Filters</Button>
        <Button variant="primary" icon={<IconPlus size={16} />}>Create new</Button>
      </div>
    </div>
    <div className="module-placeholder-grid">
      <article className="module-placeholder-card module-placeholder-card--wide">
        <div className="placeholder-icon"><IconClock size={21} /></div>
        <div>
          <h3>{title} workspace is ready</h3>
          <p>This module is connected to the application shell. Its live records and actions can be added here without changing the surrounding navigation.</p>
        </div>
        <span className="placeholder-status"><span />Coming next</span>
      </article>
      <article className="module-placeholder-card">
        <span className="placeholder-card-label">Quick insight</span>
        <strong>Data connection pending</strong>
        <p>Once records are available, this area will summarize the most important activity.</p>
        <span className="placeholder-link">Explore module <IconArrowUpRight size={15} /></span>
      </article>
      <article className="module-placeholder-card">
        <span className="placeholder-card-label">Recommended next step</span>
        <strong>Define your first view</strong>
        <p>Choose the filters, columns, and permissions that matter to your team.</p>
        <span className="placeholder-link">Configure view <IconArrowUpRight size={15} /></span>
      </article>
    </div>
  </section>
);

export default ModulePlaceholder;
