import Typography from "typography";
// investigate types
import moraga from "typography-theme-moraga";

const typography = new Typography(moraga);
export default typography.toString();

// Output CSS as string.
// export default typography.toString()

// Or insert styles directly into the <head> (works well for client-only
// JS web apps.
