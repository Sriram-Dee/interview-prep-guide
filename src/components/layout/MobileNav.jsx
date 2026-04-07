import { SECTIONS } from '../../constants';

export default function MobileNav({ activeSection, onSectionChange }) {
  return (
    <div className="mobile-nav">
      {SECTIONS.flatMap((group) =>
        group.items.map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? 'active' : ''}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))
      )}
    </div>
  );
}
