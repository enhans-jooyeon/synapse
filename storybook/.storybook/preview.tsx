import React, { useEffect } from "react";
import type { Preview, Decorator } from "@storybook/react";
// The token layer IS the spec's generated CSS — never fork it into this workspace.
import "../../tokens/synapse.css";

/** Toolbar globals mirror the component browser: theme × density × locale. */
export const globalTypes = {
  theme: {
    description: "Color mode",
    defaultValue: "light",
    toolbar: { icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
  },
  density: {
    description: "Region density (data-density)",
    defaultValue: "focus",
    toolbar: { icon: "grid", items: ["focus", "dense"], dynamicTitle: true },
  },
  locale: {
    description: "Sample-content locale",
    defaultValue: "en",
    toolbar: { icon: "globe", items: ["en", "ko"], dynamicTitle: true },
  },
};

const withSynapse: Decorator = (Story, ctx) => {
  const { theme, density, locale } = ctx.globals;
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return (
    <div
      className="sy-root"
      data-density={density}
      lang={locale}
      style={{ padding: "var(--sy-space-24)", background: "var(--sy-bg-page)" }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withSynapse],
  parameters: {
    backgrounds: { disable: true }, // tokens own the background
    controls: { expanded: true },
  },
};
export default preview;
