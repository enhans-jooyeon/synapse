export { Button } from "./components/Button/Button";
export type { ButtonProps } from "./components/Button/Button";
export { Badge } from "./components/Badge/Badge";
export type { BadgeProps } from "./components/Badge/Badge";
export { Input } from "./components/Input/Input";
export type { InputProps } from "./components/Input/Input";
export { Card } from "./components/Card/Card";
export type { CardProps } from "./components/Card/Card";

/* ---- Chat surface (added 2026-08-03 — chat-interface gap audit) ----
   Specs: components.md · Thread / Message / AnswerHeader / VariantPager /
   Reasoning / SelectionPill / FollowUpPanel / ConversationSummary.
   Behavior: ai-patterns.md §2, §12, §14, §18–20, §22, §34. */
/* FloatingPill is the shared shell for SelectionPill and Thread's jump affordance
   (components.md · FloatingPill, declared 2026-08-03). ResponseToolbar's media rail was
   the third consumer and was retired the same day. */
export { FloatingPill, FloatingPillSeparator } from "./components/FloatingPill/FloatingPill";
export type { FloatingPillProps } from "./components/FloatingPill/FloatingPill";
export { Thread } from "./components/Thread/Thread";
export type { ThreadProps } from "./components/Thread/Thread";
export { Message } from "./components/Message/Message";
export type { MessageProps } from "./components/Message/Message";
export { AnswerHeader } from "./components/AnswerHeader/AnswerHeader";
export type { AnswerHeaderProps } from "./components/AnswerHeader/AnswerHeader";
export { VariantPager, MAX_VARIANTS } from "./components/VariantPager/VariantPager";
export type { VariantPagerProps } from "./components/VariantPager/VariantPager";
export { Reasoning } from "./components/Reasoning/Reasoning";
export type { ReasoningProps } from "./components/Reasoning/Reasoning";
export { SelectionPill, SELECTION_ACTIONS } from "./components/SelectionPill/SelectionPill";
export type { SelectionPillProps, SelectionAction } from "./components/SelectionPill/SelectionPill";
export { FollowUpPanel, MAX_FOLLOWUP_ROWS } from "./components/FollowUpPanel/FollowUpPanel";
export type { FollowUpPanelProps, FollowUpRow } from "./components/FollowUpPanel/FollowUpPanel";
export { ConversationSummary } from "./components/ConversationSummary/ConversationSummary";
export type { ConversationSummaryProps } from "./components/ConversationSummary/ConversationSummary";
