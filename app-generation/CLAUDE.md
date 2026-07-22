# Component Catalog — 작업 컨텍스트

## 파일
- `component-catalog.html` — ECharts 5 기반 Synapse 디자인 시스템 차트 컴포넌트 카탈로그 (단일 HTML, 외부 의존 없음)

---

## 디자인 시스템: @enhans-jooyeon/synapse

### 핵심 색상 토큰
| 용도 | 값 |
|------|-----|
| TextPrimary | #09090B |
| TextSecondary | #62626B |
| Brand | #0621C4 |
| Error | #DB504D |
| Success | #1F9D5B |
| Background/0 | #ffffff |
| Background/50 | #FAFAFB |
| Border/100 | #E9E9ED |

### Blue Scale (차트 주 색상)
| 토큰 | 값 |
|------|-----|
| Blue/50 | #eeeffb |
| Blue/200 | #9ba6e7 |
| Blue/300 | #6f7edd |
| Blue/400 | #384dd0 |
| Blue/500 | #0621C4 |
| Blue/600 | #051AA0 |
| Blue/700 | #051a99 |
| Blue/800 | #041476 |

### Gray Scale
| 토큰 | 값 |
|------|-----|
| Gray/200 | #F4F4F6 |
| Gray/300 | #E9E9ED |
| Gray/600 | #62626B |
| Gray/900 | #09090B |

### Border Radius
| 토큰 | px |
|------|-----|
| radius-xs | 2 |
| radius-sm | 4 |
| radius-md | 6 |
| radius-lg | 8 |
| radius-xl | 12 |
| radius-round | 9999 |

### Typography
- Font: `Pretendard Variable`
- `text-label-1` ~ `text-label-4`: 16/14/12/11px
- `text-body-1` ~ `text-body-4`: 18/16/14/12px
- `text-caption-1` ~ `text-caption-3`: 12/11/10px

---

## 차트 공통 스펙

### Legend 아이콘 (고정, 변경 금지)
```javascript
const ICON = 'path://M2,0L8,0Q10,0,10,2L10,8Q10,10,8,10L2,10Q0,10,0,8L0,2Q0,0,2,0Z';
// LG: itemWidth:10, itemHeight:10, padding:0
// MD: itemWidth:8,  itemHeight:8,  padding:0
// 아이콘↔텍스트 간격: 6px
```

### LG / MD 기준
- **LG**: 기준 차트 사이즈
- **MD**: LG 대비 약 0.62 비율 축소, 폰트/아이콘/gap 등 모두 비례 축소

### 공통 축 테마 (`t` 객체)
```javascript
const t = { tc: '#09090B', sl: '#E9E9ED' };
// tc: tick/label 색상, sl: splitLine/axisLine 색상
```

### 공통 tooltip
```javascript
const tooltip = {
  backgroundColor: '#ffffff',
  borderColor: '#E9E9ED',
  textStyle: { color: '#09090B', fontSize: 12, fontFamily: 'Pretendard Variable' }
};
```

---

## 구현된 차트 목록

### 1. 콤보 차트 (`comboChart`)
- 막대(매출/목표) + 라인(성장률), 이중 y축
- 크기: 자동(ResizeObserver)

### 2. 스택 막대 (`stackChart` / `stackChartMd`)
- LG: barWidth 80, borderRadius [6,6,0,0]
- MD: barWidth 62, borderRadius [4,4,0,0]
- `yAxis: min:0, max:120, interval:20`
- 가로 리사이즈 가능 (ResizeObserver + drag handle)

### 3. 발산형 막대 — "워터폴" (`divBarLg` / `divBarMd`)
- 수평 발산형, 음수(좌)/양수(우) 엇갈린 배치
- **핵심**: `barGap:'-100%'`로 같은 y축 위치에 겹쳐 배치
- **핵심**: `null` 값으로 음수/양수 행 분리
- LG: 770×460, barWidth 70
- MD: 477×285, barWidth는 `Math.round(70 * h/460)` 비율 계산
- xAxis: `min:-4, max:4, interval:1`
- grid: `{top:28, right:16, bottom:44, left:40}`
- 색상: 음수(negGrad: Blue/500→Blue/300), 양수(posGrad: Blue/800→Blue/600)
  ```javascript
  const negGrad = { type:'linear', x:0,y:0,x2:1,y2:0,
    colorStops:[{offset:0,color:'#0621C4'},{offset:0.65,color:'#0621C4'},
                {offset:0.65,color:'#6f7edd'},{offset:1,color:'#6f7edd'}] };
  const posGrad = { type:'linear', x:0,y:0,x2:1,y2:0,
    colorStops:[{offset:0,color:'#041476'},{offset:0.65,color:'#041476'},
                {offset:0.65,color:'#051AA0'},{offset:1,color:'#051AA0'}] };
  ```

### 4. 라인 / 에어리어 차트 (4종)
- `areaChart`, `areaFillChart`, `lineMultiChart`, `areaMultiChart`
- 각각 MD 버전 포함 (`*ChartMd`)
- `boundaryGap:false` — 라인이 차트 좌우 끝에서 시작
- `yAxis: min:0, max:120, interval:20`
- LG grid: `{top:10, right:16, bottom:32, left:40}` (legend 있을 때 top:58)
- MD grid: `{top:8, right:12, bottom:24, left:30}` (legend 있을 때 top:44)
- 심볼: circle, LG symbolSize:7, MD symbolSize:5
- 에어리어 fill: Blue 0.15→0.02 그라디언트

### 5. 도넛 차트 (3종)
- `donutChart`: 일반 도넛 (4-시리즈)
- `donutBasicChart`: 단일 값 표시용
- `donutNestedChart`: 동심원 3겹
- 각각 MD 버전 포함
- LG: 440×288, radius [92,134], center ['66%','50%'], borderRadius:6
- MD: 360×222, radius [69,101], center ['68%','50%'], borderRadius:4

### 6. 산점도 — 버블차트 (`scatterChart`)
- 버블 크기별 Label/Description 폰트 비율 자동 계산 (`mkBubLabel`)
- xAxis min:0 (버블 overflow 방지)
- 가로 리사이즈 가능

### 7. 트리맵 (`treemapChart`)
- 크기: 1143×746
- 단일 시리즈 flat 데이터, 모노크로매틱 블루 (Blue/50, 200, 300, 600, 800)
- 값 크기에 따라 폰트 자동 조정: 180+→16/14px, 100+→14/12px, 50+→12/11px, 30+→11/10px, ~→10/10px
- `gapWidth:0`, 흰색 border(1.5px)로 셀 구분
- HTML legend (`.chart-leg`) 사용 — ECharts legend flat 데이터에서 동작 안 함
- `emphasis: {disabled:true}`, `roam:false`, `nodeClick:false`

---

## CSS 규칙

```css
.card { padding:28px; gap:24px; border-radius:8px; border:1px solid #E9E9ED; }
.card h3 { font-size:24px; font-weight:600; }
.card-sub { font-size:16px; color:#09090B; } /* 설명 텍스트, 마침표 없음 */
.chart-box { margin-top:8px; margin-bottom:8px; } /* 차트 위아래 여백 */
.chart-leg { display:flex; gap:16px; font-size:12px; } /* HTML legend */
.badge.blue { /* LG/MD 뱃지 */ }
```

---

## 버블 라벨 스펙 (재사용)
| 버블 지름 | Label 폰트 | Description 폰트 |
|-----------|-----------|-----------------|
| 88px | 10px / weight 500 | 10px / weight 400 |
| 148px | 12px / weight 500 | 11px / weight 400 |
| 208px | 14px / weight 500 | 12px / weight 400 |
| 248px | 16px / weight 500 | 14px / weight 400 |
| 288px | 18px / weight 500 | 16px / weight 400 |

- color: Label #09090B, Description #62626B
- fontFamily: `Pretendard Variable`
- spacing: 0, padding: 0, 가운데 정렬

---

## 주요 결정 사항 및 트릭

1. **발산형 막대 엇갈림**: `barGap:'-100%'` + null 값으로 구현. stack 쓰면 안 됨.
2. **트리맵 outer border 제거**: `levels[0]: {itemStyle:{borderWidth:0}}` 필수.
3. **flat treemap legend**: ECharts legend가 동작 안 해서 HTML `.chart-leg` div로 대체.
4. **산점도 버블 overflow**: `xAxis.min:0` 으로 해결 (min:1 이면 좌측 버블 클리핑).
5. **MD barWidth 비율**: `Math.round(lgBarWidth * height / lgHeight)` 공식 사용.
6. **설명 텍스트**: `.card-sub` 내용에 마침표 없음.
