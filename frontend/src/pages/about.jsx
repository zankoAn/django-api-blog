import React from "react";
import { useParams } from "react-router-dom";
import { useFetchUser } from "../hooks/user/users";

import LoadingBar from "../components/base/progress";
import ErrorMsg from "../components/base/error";

import "./about.css";

function GetContactLogo({ contact }) {
  if (contact.includes("linkedin")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z" />
      </svg>
    );
  } else if (contact.includes("github")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M12 .5c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.261.82-.577v-2.234c-3.338.724-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.091-.745.083-.73.083-.73 1.205.084 1.84 1.24 1.84 1.24 1.07 1.834 2.809 1.304 3.494.997.108-.775.418-1.304.762-1.604-2.665-.3-5.466-1.333-5.466-5.932 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.98-.399 3-.405 1.02.006 2.043.139 3 .405 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.769.84 1.236 1.91 1.236 3.221 0 4.61-2.803 5.629-5.475 5.921.429.37.814 1.102.814 2.222v3.293c0 .319.218.694.825.577 4.765-1.585 8.198-6.082 8.198-11.385 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  } else if (contact.includes("gmail")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    );
  } else if (contact.includes("+98")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M19.44,13c-.22,0-.45-.07-.67-.12a9.44,9.44,0,0,1-1.31-.39,2,2,0,0,0-2.48,1l-.22.45a12.18,12.18,0,0,1-2.66-2,12.18,12.18,0,0,1-2-2.66L10.52,9a2,2,0,0,0,1-2.48,10.33,10.33,0,0,1-.39-1.31c-.05-.22-.09-.45-.12-.68a3,3,0,0,0-3-2.49h-3a3,3,0,0,0-3,3.41A19,19,0,0,0,18.53,21.91l.38,0a3,3,0,0,0,2-.76,3,3,0,0,0,1-2.25v-3A3,3,0,0,0,19.44,13Zm.5,6a1,1,0,0,1-.34.75,1.05,1.05,0,0,1-.82.25A17,17,0,0,1,4.07,5.22a1.09,1.09,0,0,1,.25-.82,1,1,0,0,1,.75-.34h3a1,1,0,0,1,1,.79q.06.41.15.81a11.12,11.12,0,0,0,.46,1.55l-1.4.65a1,1,0,0,0-.49,1.33,14.49,14.49,0,0,0,7,7,1,1,0,0,0,.76,0,1,1,0,0,0,.57-.52l.62-1.4a13.69,13.69,0,0,0,1.58.46q.4.09.81.15a1,1,0,0,1,.79,1Z" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M5,13 L19,13 L19,6.5 C19,5.67157288 18.3284271,5 17.5,5 L6.5,5 C5.67157288,5 5,5.67157288 5,6.5 L5,13 Z M20,13.4 L21.8846154,17.9230769 C21.9607842,18.1058822 22,18.301961 22,18.5 C22,19.3284271 21.3284271,20 20.5,20 L3.5,20 C3.30196097,20 3.10588218,19.9607842 2.92307692,19.8846154 C2.15837496,19.5659896 1.7967588,18.6877789 2.11538462,17.9230769 L4,13.4 L4,6.5 C4,5.11928813 5.11928813,4 6.5,4 L17.5,4 C18.8807119,4 20,5.11928813 20,6.5 L20,13.4 Z M4.83333333,14 L3.03846154,18.3076923 C2.93225293,18.562593 3.05279165,18.8553299 3.30769231,18.9615385 C3.36862739,18.9869281 3.43398699,19 3.5,19 L20.5,19 C20.7761424,19 21,18.7761424 21,18.5 C21,18.433987 20.9869281,18.3686274 20.9615385,18.3076923 L19.1666667,14 L4.83333333,14 Z M6.5,16 C6.22385763,16 6,15.7761424 6,15.5 C6,15.2238576 6.22385763,15 6.5,15 L7.5,15 C7.77614237,15 8,15.2238576 8,15.5 C8,15.7761424 7.77614237,16 7.5,16 L6.5,16 Z M5.5,18 C5.22385763,18 5,17.7761424 5,17.5 C5,17.2238576 5.22385763,17 5.5,17 L6.5,17 C6.77614237,17 7,17.2238576 7,17.5 C7,17.7761424 6.77614237,18 6.5,18 L5.5,18 Z M8.5,18 C8.22385763,18 8,17.7761424 8,17.5 C8,17.2238576 8.22385763,17 8.5,17 L12.5,17 C12.7761424,17 13,17.2238576 13,17.5 C13,17.7761424 12.7761424,18 12.5,18 L8.5,18 Z M14.5,18 C14.2238576,18 14,17.7761424 14,17.5 C14,17.2238576 14.2238576,17 14.5,17 L15.5,17 C15.7761424,17 16,17.2238576 16,17.5 C16,17.7761424 15.7761424,18 15.5,18 L14.5,18 Z M17.5,18 C17.2238576,18 17,17.7761424 17,17.5 C17,17.2238576 17.2238576,17 17.5,17 L18.5,17 C18.7761424,17 19,17.2238576 19,17.5 C19,17.7761424 18.7761424,18 18.5,18 L17.5,18 Z M9.5,16 C9.22385763,16 9,15.7761424 9,15.5 C9,15.2238576 9.22385763,15 9.5,15 L10.5,15 C10.7761424,15 11,15.2238576 11,15.5 C11,15.7761424 10.7761424,16 10.5,16 L9.5,16 Z M12.5,16 C12.2238576,16 12,15.7761424 12,15.5 C12,15.2238576 12.2238576,15 12.5,15 L13.5,15 C13.7761424,15 14,15.2238576 14,15.5 C14,15.7761424 13.7761424,16 13.5,16 L12.5,16 Z M15.5,16 C15.2238576,16 15,15.7761424 15,15.5 C15,15.2238576 15.2238576,15 15.5,15 L16.5,15 C16.7761424,15 17,15.2238576 17,15.5 C17,15.7761424 16.7761424,16 16.5,16 L15.5,16 Z" />
      </svg>
    );
  }
}

function AboutMe() {
  let { user_id } = useParams();
  const { isLoading, error, data, progress } = useFetchUser(user_id);
  const user = data || { resume: { } };
  window.scrollTo({ top: 50, behavior: "smooth" });

  if (isLoading) {
    return <LoadingBar progress={progress} />;
  }

  if (error) {
    return <ErrorMsg message={error.message} />;
  }

  return (
    <>
      <div className="rope"></div>
      <div className="about">
        <header>
          <div className="contacts">
            {user.resume?.contacts.map((contact, index) => (
              <span key={index} className="contact">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <GetContactLogo contact={contact} />
                </svg>
                {/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(contact) ? (
                  <a id={index} href={`https://${contact}`}>
                    {contact}
                  </a>
                ) : (
                  <span>{contact}</span>
                )}
              </span>
            ))}
          </div>
          <div className="me">
            <span className="name">{user.username}</span>
            <span className="job">
              {user.resume?.current_position.toUpperCase()}
            </span>
          </div>
          <img className="avatar" src={user.resume?.avatar} alt="" />
        </header>
        <div className="summary">
          <h1>SUMMARY</h1>
          <div>{user.resume?.summary}</div>
        </div>
        <div className="details">
          <div className="experiences">
            <h1>WORK EXPERIENCE</h1>
            {user.resume?.work_experiences.map((work_exp, index) => (
              <div key={index} className="work-exps">
                <div className="top-head">
                  <span className="position-cmp">
                    {work_exp.position} -<p>{work_exp.company_name}</p>
                  </span>
                  <span className="time">{work_exp.work_duration}</span>
                  <div className="links">
                    {work_exp.links.map((link, index) => (
                      <span key={index} className="link">
                        {link}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="overview">
                  <span className="summary">{work_exp.summary}</span>
                  <div className="achievements">
                    <span className="achievement-title">
                      Achievements/Tasks
                    </span>
                    {work_exp.achievements.map((task, index) => (
                      <span key={index} className="achievement">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar">
          <div className="skills">
            <h1>SKILLS</h1>
            {user.resume?.skills.map((skill, index) => (
              <span key={index} className={`skill-${index}`}>
                {skill}
              </span>
            ))}
          </div>
          <div className="soft-skills">
            <h1>SOFT SKILLS</h1>
            {user.resume?.soft_skills.map((soft_skill, index) => (
              <span key={index} className="soft-skill">
                {soft_skill}
              </span>
            ))}
          </div>
          <div className="social">
            <h1>Social</h1>
            {user.resume?.soft_skills.map((soft_skill, index) => (
              <span key={index} className="soft-skill">
                {soft_skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutMe;
