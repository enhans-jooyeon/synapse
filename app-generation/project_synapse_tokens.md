---
name: Synapse Design System Color Tokens
description: @enhans/synapse 디자인 시스템 색상 토큰 매핑 — 컴포넌트 작업 시 반드시 참조
type: reference
originSessionId: 86065e6d-1625-45ce-a895-0519665e3784
---
# Synapse Design System — 핵심 색상 토큰

> **⚠️ SUPERSEDED (v1.0.0).** This was the catalog's own token snapshot on the old azure system. It has been value-reconciled to Synapse v1.0.0, but **`tokens/synapse.tokens.json` is the single source of truth** and `app-generation/tokens-map.md` is the authoritative old→new mapping. Kept for provenance only — do not treat this file as a token authority.

## Background
| Token | Value | Usage |
|-------|-------|-------|
| `bg-background-0` | `#ffffff` | 페이지 배경 (기본 흰색) |
| `bg-background-50` | `#FAFAFB` | Subtle surface (카드 배경) |
| `bg-background-100` | `#F4F4F6` | Card / input background |
| `bg-background-200` | `#F4F4F6` | Elevated surface |
| `bg-background-inverted` | `#09090B` | Dark surface |

> HTML 목업 파일 변수 매핑: `--bg2(#ffffff)` = bg-0, `--bg(#FAFAFB)` ≈ bg-50, `--bg3(#F4F4F6)` = bg-200

## Border
| Token | Value | Usage |
|-------|-------|-------|
| `border-border-100` | `#E9E9ED` | 기본 보더 (대부분 UI) |
| `border-border-200` | `#D1D1D8` | 강조 보더 (인풋 기본 상태 등) |
| `border-border-300` | `#83838D` | 강한 보더 |
| `border-border-900` | `#09090B` | 가장 어두운 보더 |

> ⚠️ 주의: 기존 HTML 파일의 `--border2`가 `#D1D1D8`로 잘못 정의되어 있었음 → 올바른 border-200은 `#D1D1D8`

## Text
| Token | Value | Usage |
|-------|-------|-------|
| `text-text-primary` | `#09090B` | 기본 텍스트 |
| `text-text-secondary` | `#62626B` | 설명, 플레이스홀더 |
| `text-text-tertiary` | `#83838D` | 힌트, 미묘한 레이블 |
| `text-text-inverted` | `#ffffff` | 어두운 배경 위 텍스트 |
| `text-text-error` | `#DB504D` | 에러 |
| `text-text-success` | `#1F9D5B` | 성공 |
| `text-text-brand` | `#0621C4` | 브랜드 텍스트/링크 |

## Icon
| Token | Value |
|-------|-------|
| `text-icon-primary` | `#09090B` |
| `text-icon-secondary` | `#62626B` |
| `text-icon-tertiary` | `#83838D` |

## Button (key)
| Token | Value |
|-------|-------|
| `bg-button-primary` | `#09090B` |
| `bg-button-primary-hover` | `#4d4d4c` |
| `bg-button-destructive` | `#DB504D` |
| `bg-button-brand` | `#0621C4` |
| `bg-button-brand-hover` | `#051AA0` |

## Border Radius
| Token | Value |
|-------|-------|
| `rounded-small` | 4px |
| `rounded-medium` | 6px |
| `rounded-large` | 8px |
| `rounded-xlarge` | 12px |
| `rounded-round` | 9999px |

## Shadow
| Token | Usage |
|-------|-------|
| `shadow-xs` | Inputs, small cards |
| `shadow-sm` | Cards, panels |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | Modals, dialogs |
| `shadow-glow` | Focus ring (brand blue) |
