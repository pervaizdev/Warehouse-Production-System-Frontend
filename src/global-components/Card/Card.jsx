import './Card.css';

const Card = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="dome-card-grid">
      {items.map((item, index) => {
        const CardContent = (
          <div className="dome-card">
            {item.icon && (
              <div className="dome-card-icon" aria-hidden="true">
                <item.icon />
              </div>
            )}
            <h3 className="dome-card-title">{item.title}</h3>
            {item.description && <p className="dome-card-desc">{item.description}</p>}
          </div>
        );

        if (item.link) {
          return (
            <a key={index} href={item.link} className="dome-card-link">
              {CardContent}
            </a>
          );
        }

        return <div key={index}>{CardContent}</div>;
      })}
    </div>
  );
};

export default Card;
