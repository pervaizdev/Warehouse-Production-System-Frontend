import './Tabs.css';

const DomeTabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  className = ''
}) => {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div className={`global-tab-group-pills ${className}`.trim()}>
      {tabs.map((tab) => {
        if (tab.hidden) return null;

        const isActive = activeTab === tab.key;
        const pillClass = `global-tab-pill ${isActive ? 'active' : ''}`.trim();

        return (
          <button
            key={tab.key}
            className={pillClass}
            onClick={() => onTabChange && onTabChange(tab.key)}
            type="button"
          >
            {tab.icon && (
              <span className="global-tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span className="global-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DomeTabs;
