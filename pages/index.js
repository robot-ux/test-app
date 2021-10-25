import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .tippy-box {
    &[data-theme*='bc-honeycomb-bare'] {
      font-size: 1rem;
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      overflow: visible;

      .tippy-content {
        padding: 0;
        z-index: 100;
      }

      .tippy-arrow {
        z-index: 200;
      }

      &[data-theme*='-GoldDark-normal'] {
        .tippy-arrow {
          color: red;
        }
      }

      &[data-theme*='-GoldLight-normal'] {
        .tippy-arrow {
          color: white;
        }
      }

      &[data-theme*='-GoldDark-accent'] {
        .tippy-arrow {
          color: black;
        }
      }

      &[data-theme*='-GoldLight-accent'] {
        .tippy-arrow {
          color: pink;
        }
      }
    }
  }
`;

const data = new Array(100).fill(1).map((_, idx) => idx);

export default function Home() {
  const container = React.useMemo(() => {
    return (
      <div
        style={{
          overflow: 'scroll',
          height: 200,
          border: '2px dashed red',
        }}
      >
        {data.map((item) => (
          <div key={item}>
            {/* Warning: Using GlobalStyle in a loop will have a performance issue. */}
            <GlobalStyle />
            <div>hello,world {item}</div>
          </div>
        ))}
      </div>
    );
  }, [data]);

  return (
    <div>
      {/* <GlobalStyle /> */}
      <h4>Tooltip Iteration Count: {data.length}</h4>
      {container}
    </div>
  );
}
