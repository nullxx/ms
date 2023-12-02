import "./Solution.css";
import * as React from "react";
import Code from "../Code/Code";

export default function Solution({
  title = "Solution",
  sol = [],
  testCodeText = "Test code",
  solutionIsCode = true,
  children,
}: {
  title?: string;
  sol?: (string)[];
  testCodeText?: string;
  solutionIsCode?: boolean;
  children?: React.ReactNode;

}) {
  const id = Math.random().toString(36).substring(7);

  return (
    <div className="tab tabs">
      <input type="checkbox" id={id} />
      <label className="tab-label" htmlFor={id}>
        {title}
      </label>
      <div className="tab-content">
        {sol.length > 1
          ? sol.map((sol, i) => (
              <div key={i}>
                <span>
                  {title} {i + 1}
                </span>
                {(solutionIsCode && typeof sol === 'string') && <Code code={sol} testCodeText={testCodeText} />}
                {children}
              </div>
            ))
          : (
              <div>
                {solutionIsCode  && typeof sol === 'string' && <Code code={sol[0]} testCodeText={testCodeText} />}
                {children}
              </div>
          )}
      </div>
    </div>
  );
}
