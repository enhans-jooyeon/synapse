/**
 * Synapse component-provenance + raw-value ESLint rules for the product repo.
 * Merge into the product repo's ESLint config. Pairs with tailwind.synapse.cjs
 * (which handles the arbitrary-value / token enforcement) and jsx-a11y.
 *
 * Mirrors design.md §3 hard rules and 디자인-리뷰-프로토콜.md §6 for React/JSX.
 */
module.exports = {
  plugins: ['jsx-a11y'],
  extends: ['plugin:jsx-a11y/recommended'],
  rules: {
    // Component provenance — if the system has it, use it (never a raw element).
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "JSXOpeningElement[name.name=/^(button|input|select|textarea|dialog|table)$/]",
        message:
          'Use the @enhans/synapse component (Button, Input, Select, Textarea, Modal, Table), not a raw element. Missing capability → harness ticket, not a raw element (protocol §9).',
      },
      {
        // No inline style objects with literal color/size values — tokens only.
        selector: "JSXAttribute[name.name='style'] Literal[value=/#[0-9a-fA-F]{3,8}|[0-9.]+px|rgb/]",
        message:
          'Raw color/size in an inline style. Use Synapse tokens / Tailwind token classes (SY001/SY002).',
      },
    ],
    // Imports must come from the system, not sibling re-implementations.
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/components/ui/*', '!@enhans/synapse'],
            message:
              'Import UI primitives from @enhans/synapse, not local re-implementations (one-way door rule, design.md §6).',
          },
        ],
      },
    ],
  },
};
