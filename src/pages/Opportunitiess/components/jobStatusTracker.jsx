// import React, { useState } from "react";

// const JobStatusTracker = () => {
//   const [openPanel, setOpenPanel] = useState(null);

//   // const timelineSteps = [
//   //   {
//   //     id: "created",
//   //     title: "Job Created",
//   //     date: "Tuesday, 28 May 2024",
//   //     status: "completed",

//   //     detail: {
//   //       title: "Job Created Successfully",
//   //       description:
//   //         "The job posting has been created and published. The recruitment process has officially started.",
//   //     },
//   //   },
//   //   {
//   //     id: "applied",
//   //     title: "Applied Candidates",
//   //     date: "Last, 4 hours ago",
//   //     status: "active",

//   //     count: 24,
//   //     detail: {
//   //       title: "24 Candidates Applied",
//   //       description:
//   //         "Total applications received. Review and shortlist the most qualified candidates for the next stage.",
//   //       candidates: [
//   //         { name: "Sarah Johnson", role: "Senior Developer" },
//   //         { name: "Michael Chen", role: "Full Stack Engineer" },
//   //         { name: "Emma Wilson", role: "Backend Specialist" },
//   //       ],
//   //     },
//   //   },
//   //   {
//   //     id: "shortlisted",
//   //     title: "Shortlisted Candidates",
//   //     date: "Last, 1 Day ago",
//   //     status: "pending",

//   //     count: 3,
//   //     detail: {
//   //       title: "3 Candidates Shortlisted",
//   //       description:
//   //         "These candidates have passed the initial screening and are moving forward in the hiring process.",
//   //     },
//   //   },
//   //   {
//   //     id: "rejected",
//   //     title: "Rejected Candidates",
//   //     date: "Last, 1 Day ago",
//   //     status: "pending",

//   //     count: 5,
//   //     detail: {
//   //       title: "5 Candidates Rejected",
//   //       description:
//   //         "These candidates did not meet the requirements for this position at this time.",
//   //     },
//   //   },
//   //   {
//   //     id: "interview",
//   //     title: "Interview Scheduled",
//   //     date: "Last, 1 Day ago",
//   //     status: "pending",

//   //     count: 10,
//   //     detail: {
//   //       title: "10 Interviews Scheduled",
//   //       description:
//   //         "Interview sessions have been scheduled with the shortlisted candidates. Prepare interview questions and materials.",
//   //     },
//   //   },
//   //   {
//   //     id: "selected",
//   //     title: "Selected Candidates",
//   //     date: "Tuesday, 28 May 2024",
//   //     status: "pending",
//   //     hasBadge: false,
//   //     //   candidate: {
//   //     //     name: 'Ankit kumar',
//   //     //     avatar: true
//   //     //   },
//   //     detail: {
//   //       title: "Ankit kumar Selected",
//   //       description:
//   //         "Congratulations! The final candidate has been selected for this position. Proceed with the offer letter and onboarding process.",
//   //     },
//   //   },
//   // ];
// const timelineSteps = [
//   {
//     id: "created",
//     title: "Job Created",
//     date: "Tuesday, 28 May 2024",
//     status: "completed",
//   },
//   {
//     id: "applied",
//     title: "Applied Candidates",
//     date: "Recently",
//     status: "active",
//     count: data?.total_applicants || 0,
//   },
//   {
//     id: "shortlisted",
//     title: "Shortlisted Candidates",
//     date: "Recently",
//     status: "pending",
//     count: data?.shortlisted_count || 0,
//   },
//   {
//     id: "rejected",
//     title: "Rejected Candidates",
//     date: "Recently",
//     status: "pending",
//     count: data?.rejected_count || 0,
//   },
//   {
//     id: "interview",
//     title: "Interview Scheduled",
//     date: "Recently",
//     status: "pending",
//     count: data?.scheduled_interview_count || 0,
//   },
//   {
//     id: "selected",
//     title: "Selected Candidates",
//     date: "Recently",
//     status: "pending",
//     count: data?.selected_count || 0,
//   },
// ];

//   const handleStepClick = (stepId) => {
//     setOpenPanel(openPanel === stepId ? null : stepId);
//   };

//   return (
//     <div>
//       <div className="glassy-card p-6">
//         <div style={styles.header}>
//           <h1 style={styles.headerTitle} className=" glassy-text-primary ">Job Status</h1>
//           {/* <div style={styles.notificationBadge}>
//             <div style={styles.notificationDot}></div>
//           </div> */}
//         </div>

//         <div style={styles.timeline}>
//           {timelineSteps.map((step, index) => (
//             <React.Fragment key={step.id}>
//               <div
//                 style={{
//                   ...styles.timelineItem,
//                   ...(index !== timelineSteps.length - 1
//                     ? styles.timelineItemWithLine
//                     : {}),
//                 }}
//                 // onClick={() => handleStepClick(step.id)}
//               >
//                 <div
//                   style={{
//                     ...styles.iconContainer,
//                     ...(step.status === "completed"
//                       ? styles.iconContainerCompleted
//                       : {}),
//                     ...(step.status === "active"
//                       ? styles.iconContainerActive
//                       : {}),
//                   }}
//                 >
//                   <span style={styles.checkmark}>
//                     {step.status === "completed"
//                       ? "✓"
//                       : step.status === "active"
//                         ? "●"
//                         : "○"}
//                   </span>
//                 </div>

//                 <div style={styles.infoSection}>
//                   <div style={styles.infoLeft}>
//                     <div className="h2 glassy-text-primary">
//                       {step.title}
//                       {/* {step.hasBadge && (
//                         <div style={styles.stepBadge}>
//                           <div style={styles.stepBadgeDot}></div>
//                         </div>
//                       )} */}
//                     </div>
//                     <div style={styles.stepDate}>{step.date}</div>
//                   </div>

//                   {step.count !== undefined && (
//                     <div style={styles.countBadge}>{step.count}</div>
//                   )}

//                   {step.candidate && (
//                     <div style={styles.selectedCandidate}>
//                       <div style={styles.candidateAvatar}></div>
//                       <div style={styles.candidateName}>
//                         {step.candidate.name}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {index !== timelineSteps.length - 1 && (
//                   <div
//                     style={{
//                       ...styles.timelineLine,
//                       ...(step.status === "completed"
//                         ? styles.timelineLineCompleted
//                         : {}),
//                       ...(step.status === "active"
//                         ? styles.timelineLineActive
//                         : {}),
//                     }}
//                   ></div>
//                 )}
//               </div>

//               {/* {openPanel === step.id && (
//                 <div style={styles.detailPanel}>
//                   <h3 style={styles.detailTitle}>{step.detail.title}</h3>
//                   <p style={styles.detailDescription}>{step.detail.description}</p>
                  
//                   {step.detail.candidates && (
//                     <div style={styles.candidateList}>
//                       {step.detail.candidates.map((candidate, idx) => (
//                         <div key={idx} style={styles.candidateItem}>
//                           <div style={styles.miniAvatar}></div>
//                           <div style={styles.candidateInfo}>
//                             <div style={styles.candidateInfoName}>{candidate.name}</div>
//                             <div style={styles.candidateInfoRole}>{candidate.role}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )} */}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   body: {
//     background: "#0a0a0a",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "100vh",
//     padding: "20px",
//     margin: 0,
//   },
//   container: {
//     background: "#1a1a1a",
//     border: "1px solid #333",
//     borderRadius: "24px",
//     padding: "40px",
//     maxWidth: "700px",
//     width: "100%",
//     boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
//   },
//   header: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     marginBottom: "30px",
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: "32px",
//     fontWeight: "600",
//     margin: 0,
//   },
//   notificationBadge: {
//     width: "32px",
//     height: "32px",
//     // background: "linear-gradient(135deg, #ff0080, #ff4d94)",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     animation: "pulse 2s infinite",
//   },
//   notificationDot: {
//     width: "12px",
//     height: "12px",
//     background: "#fff",
//     borderRadius: "50%",
//   },
//   timeline: {
//     position: "relative",
//   },
//   timelineItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: "24px",
//     position: "relative",
//     padding: "10px 0",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//   },
//   timelineItemWithLine: {
//     position: "relative",
//   },
//   timelineLine: {
//     position: "absolute",
//     left: "19px",
//     top: "60px",
//     width: "2px",
//     height: "calc(100% - 20px)",
//     background: "#333",
//     transition: "background 0.3s ease",
//   },
//   timelineLineCompleted: {
//     background: "#4a9eff",
//   },
//   timelineLineActive: {
//     background: "linear-gradient(180deg, #4a9eff, #333)",
//   },
//   iconContainer: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: "3px solid #333",
//     background: "#1a1a1a",
//     flexShrink: 0,
//     position: "relative",
//     zIndex: 2,
//     transition: "all 0.3s ease",
//   },
//   iconContainerCompleted: {
//     borderColor: "#4a9eff",
//     background: "#4a9eff",
//   },
//   iconContainerActive: {
//     borderColor: "#4a9eff",
//     background: "#4a9eff",
//     animation: "glow 2s infinite",
//   },
//   checkmark: {
//     color: "#fff",
//     fontSize: "20px",
//     fontWeight: "bold",
//   },
//   infoSection: {
//     flex: 1,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   infoLeft: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "3px",
//   },
//   stepTitle: {
//     color: "#fff",
//     fontSize: "18px",
//     fontWeight: "500",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//   },
//   stepDate: {
//     color: "#888",
//     fontSize: "14px",
//   },
//   stepBadge: {
//     width: "24px",
//     height: "24px",
//     // background: "linear-gradient(135deg, #ff0080, #ff4d94)",
//     borderRadius: "50%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     position: "relative",
//     flexShrink: 0,
//   },
//   stepBadgeDot: {
//     width: "8px",
//     height: "8px",
//     background: "#fff",
//     borderRadius: "50%",
//   },
//   countBadge: {
//     minWidth: "60px",
//     height: "48px",
//     background: "#222",
//     border: "1px solid #333",
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#fff",
//     fontSize: "18px",
//     fontWeight: "600",
//     transition: "all 0.3s ease",
//   },
//   selectedCandidate: {
//     display: "flex",
//     alignItems: "center",
//     gap: "12px",
//     background: "#222",
//     border: "1px solid #333",
//     borderRadius: "12px",
//     padding: "12px 20px",
//     transition: "all 0.3s ease",
//   },
//   candidateAvatar: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #4a9eff, #0066cc)",
//   },
//   candidateName: {
//     color: "#fff",
//     fontSize: "16px",
//     fontWeight: "500",
//   },
//   detailPanel: {
//     marginTop: "20px",
//     marginBottom: "20px",
//     padding: "20px",
//     background: "#222",
//     borderRadius: "12px",
//     border: "1px solid #333",
//     animation: "slideDown 0.3s ease",
//   },
//   detailTitle: {
//     color: "#fff",
//     marginBottom: "12px",
//     fontSize: "18px",
//     margin: "0 0 12px 0",
//   },
//   detailDescription: {
//     color: "#aaa",
//     lineHeight: "1.6",
//     fontSize: "14px",
//     margin: 0,
//   },
//   candidateList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//     marginTop: "12px",
//   },
//   candidateItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     padding: "8px",
//     background: "#1a1a1a",
//     borderRadius: "8px",
//     border: "1px solid #333",
//     transition: "border-color 0.3s ease",
//   },
//   miniAvatar: {
//     width: "32px",
//     height: "32px",
//     borderRadius: "50%",
//     background: "linear-gradient(135deg, #4a9eff, #0066cc)",
//     flexShrink: 0,
//   },
//   candidateInfo: {
//     flex: 1,
//   },
//   candidateInfoName: {
//     color: "#fff",
//     fontSize: "14px",
//     fontWeight: "500",
//   },
//   candidateInfoRole: {
//     color: "#888",
//     fontSize: "12px",
//   },
// };

// // Add CSS animations
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @keyframes pulse {
//     0%, 100% {
//     //   box-shadow: 0 0 0 0 rgba(255, 0, 128, 0.7);
//     }
//     50% {
//       box-shadow: 0 0 0 10px rgba(255, 0, 128, 0);
//     }
//   }

//   @keyframes glow {
//     0%, 100% {
//       box-shadow: 0 0 20px rgba(74, 158, 255, 0.5);
//     }
//     50% {
//       box-shadow: 0 0 30px rgba(74, 158, 255, 0.8);
//     }
//   }

//   @keyframes slideDown {
//     from {
//       opacity: 0;
//       transform: translateY(-10px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default JobStatusTracker;
import React, { useState } from "react";

const JobStatusTracker = ({ data }) => {
  const [openPanel, setOpenPanel] = useState(null);

  const {
    total_applicants = 0,
    shortlisted_count = 0,
    rejected_count = 0,
    selected_count = 0,
    scheduled_interview_count = 0,
    createdAt,
  } = data || {};

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Determine current stage dynamically
  let currentStage = "created";

  if (total_applicants > 0) currentStage = "applied";
  if (shortlisted_count > 0) currentStage = "shortlisted";
  if (scheduled_interview_count > 0) currentStage = "interview";
  if (selected_count > 0) currentStage = "selected";

  const stageOrder = [
    "created",
    "applied",
    "shortlisted",
    "interview",
    "selected",
  ];

  const getStatus = (stage) => {
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stage);

    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  };

  const timelineSteps = [
    {
      id: "created",
      title: "Job Created",
      date: formatDate(createdAt), // 👈 real created date
      status: getStatus("created"),
    },
    {
      id: "applied",
      title: "Applied Candidates",
      date: "Applications Received",
      status: getStatus("applied"),
      count: total_applicants,
    },
    {
      id: "shortlisted",
      title: "Shortlisted Candidates",
      date: "Screening Completed",
      status: getStatus("shortlisted"),
      count: shortlisted_count,
    },
        {
      id: "rejected",
      title: "Rejected Candidates",
      date: "Not Selected",
      status: rejected_count > 0 ? "completed" : "pending",
      count: rejected_count,
    },
    {
      id: "interview",
      title: "Interview Scheduled",
      date: "Interview Stage",
      status: getStatus("interview"),
      count: scheduled_interview_count,
    },
    {
      id: "selected",
      title: "Selected Candidates",
      date: "Final Selection",
      status: getStatus("selected"),
      count: selected_count,
    },

  ];

  const handleStepClick = (stepId) => {
    setOpenPanel(openPanel === stepId ? null : stepId);
  };

  return (
    <div>
      <div className="glassy-card p-6">
        <div style={styles.header}>
          <h1 style={styles.headerTitle} className="glassy-text-primary">
            Job Status
          </h1>
        </div>

        <div style={styles.timeline}>
          {timelineSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                style={{
                  ...styles.timelineItem,
                  ...(index !== timelineSteps.length - 1
                    ? styles.timelineItemWithLine
                    : {}),
                }}
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  style={{
                    ...styles.iconContainer,
                    ...(step.status === "completed"
                      ? styles.iconContainerCompleted
                      : {}),
                    ...(step.status === "active"
                      ? styles.iconContainerActive
                      : {}),
                  }}
                >
                  <span style={styles.checkmark}>
                    {step.status === "completed"
                      ? "✓"
                      : step.status === "active"
                      ? "●"
                      : "○"}
                  </span>
                </div>

                <div style={styles.infoSection}>
                  <div style={styles.infoLeft}>
                    <div className="h2 glassy-text-primary">
                      {step.title}
                    </div>
                    <div style={styles.stepDate}>{step.date}</div>
                  </div>

                  {step.count !== undefined && (
                    <div style={styles.countBadge}>{step.count}</div>
                  )}
                </div>

                {index !== timelineSteps.length - 1 && (
                  <div
                    style={{
                      ...styles.timelineLine,
                      ...(step.status === "completed"
                        ? styles.timelineLineCompleted
                        : {}),
                      ...(step.status === "active"
                        ? styles.timelineLineActive
                        : {}),
                    }}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
export default JobStatusTracker;
const styles = {
  body: {
    background: "#0a0a0a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    margin: 0,
  },
  container: {
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "40px",
    maxWidth: "700px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "30px",
  },
  headerTitle: {
    color: "#fff",
    fontSize: "32px",
    fontWeight: "600",
    margin: 0,
  },
  notificationBadge: {
    width: "32px",
    height: "32px",
    // background: "linear-gradient(135deg, #ff0080, #ff4d94)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    animation: "pulse 2s infinite",
  },
  notificationDot: {
    width: "12px",
    height: "12px",
    background: "#fff",
    borderRadius: "50%",
  },
  timeline: {
    position: "relative",
  },
  timelineItem: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    position: "relative",
    padding: "10px 0",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  timelineItemWithLine: {
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: "19px",
    top: "60px",
    width: "2px",
    height: "calc(100% - 20px)",
    background: "#333",
    transition: "background 0.3s ease",
  },
  timelineLineCompleted: {
    background: "#4a9eff",
  },
  timelineLineActive: {
    background: "linear-gradient(180deg, #4a9eff, #333)",
  },
  iconContainer: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #333",
    background: "#1a1a1a",
    flexShrink: 0,
    position: "relative",
    zIndex: 2,
    transition: "all 0.3s ease",
  },
  iconContainerCompleted: {
    borderColor: "#4a9eff",
    background: "#4a9eff",
  },
  iconContainerActive: {
    borderColor: "#4a9eff",
    background: "#4a9eff",
    animation: "glow 2s infinite",
  },
  checkmark: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
  },
  infoSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  stepTitle: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  stepDate: {
    color: "#888",
    fontSize: "14px",
  },
  stepBadge: {
    width: "24px",
    height: "24px",
    // background: "linear-gradient(135deg, #ff0080, #ff4d94)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
  },
  stepBadgeDot: {
    width: "8px",
    height: "8px",
    background: "#fff",
    borderRadius: "50%",
  },
  countBadge: {
    minWidth: "60px",
    height: "48px",
    background: "#222",
    border: "1px solid #333",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  selectedCandidate: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#222",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "12px 20px",
    transition: "all 0.3s ease",
  },
  candidateAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4a9eff, #0066cc)",
  },
  candidateName: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
  },
  detailPanel: {
    marginTop: "20px",
    marginBottom: "20px",
    padding: "20px",
    background: "#222",
    borderRadius: "12px",
    border: "1px solid #333",
    animation: "slideDown 0.3s ease",
  },
  detailTitle: {
    color: "#fff",
    marginBottom: "12px",
    fontSize: "18px",
    margin: "0 0 12px 0",
  },
  detailDescription: {
    color: "#aaa",
    lineHeight: "1.6",
    fontSize: "14px",
    margin: 0,
  },
  candidateList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "12px",
  },
  candidateItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    background: "#1a1a1a",
    borderRadius: "8px",
    border: "1px solid #333",
    transition: "border-color 0.3s ease",
  },
  miniAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4a9eff, #0066cc)",
    flexShrink: 0,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateInfoName: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
  },
  candidateInfoRole: {
    color: "#888",
    fontSize: "12px",
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% {
    //   box-shadow: 0 0 0 0 rgba(255, 0, 128, 0.7);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(255, 0, 128, 0);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(74, 158, 255, 0.5);
    }
    50% {
      box-shadow: 0 0 30px rgba(74, 158, 255, 0.8);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);
