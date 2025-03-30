import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import "./MovingIcon.css"; // External CSS file for animations

const MovingIcon = ({ direction = "up", side = false }) => {
  const icon =
    direction === "down"
      ? faCaretDown
      : direction === "up"
      ? faCaretUp
      : faCaretRight;
  const animationClass = `move-${direction}`;

  return (
    <FontAwesomeIcon
      icon={icon}
      size="lg"
      color={side ? "#00ccbb" : "yellow"}
      className={animationClass} // Apply animation via CSS
    />
  );
};

export default MovingIcon;
