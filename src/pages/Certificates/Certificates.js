import React from "react";
import { SkillsCard2 } from "../../components/ui/cards/Card";
import { convertTimestampToDate } from "../../components/utils/globalFunction";

const LinkedInCertificate = ({
  certificateName,
  issueBy,
  date,
  skills = [],
  certificateUrlOrNumber,
  username = "",
  record = {},
  type = "certifications",
}) => {
  const certificateType = record?.certificate_type || "assessment";

  const isJobCertificate = certificateType === "job";

  return (
    <div className="relative w-full glassy-card rounded-xl overflow-hidden shadow-lg border">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img
          src="/Frame 1000004906.png"
          alt="Watermark"
          className="w-64 h-auto object-contain"
        />
      </div>

      {/* Header */}
      <div className="flex justify-center items-center px-6 py-4 border-b relative z-10">
        <div className="flex items-center space-x-2">
          <img src="/Frame 1000004906.png" alt="logo" />
          <span className="glassy-text-primary text-xl font-semibold">
            {isJobCertificate ? "Career Achievement" : "Learning"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 md:px-10 py-8 relative z-10 flex flex-col items-center">
        {/* Dynamic Heading */}
        <div className="text-center mb-8">
          <h1 className="glassy-text-primary text-xl md:text-2xl font-semibold leading-relaxed">
            {isJobCertificate
              ? `Certificate of Selection`
              : `Verified Professional Certification`}
          </h1>

          <p className="glassy-text-secondary mt-3 text-sm italic">
            This certifies that{" "}
            <span className="font-semibold glassy-text-primary">
              {username}
            </span>{" "}
            {isJobCertificate
              ? `has been officially selected for the role.`
              : `has successfully completed the required assessment.`}
          </p>
        </div>

        {/* Certificate Name */}
        <div className="text-center mb-8">
          <h2 className="glassy-text-primary text-2xl font-bold">
            {certificateName}
          </h2>
          <p className="glassy-text-secondary mt-2 text-sm">
            Issued by {issueBy}
          </p>
        </div>

        {/* Date */}
        <p className="glassy-text-primary text-lg font-medium mb-6">
          Awarded on {convertTimestampToDate(date)}
        </p>

        {/* Skills Only for Assessment */}
        {!isJobCertificate && skills?.length > 0 && (
          <div className="text-center mb-8">
            <h3 className="glassy-text-primary mb-2 text-base font-semibold">
              Skills Demonstrated
            </h3>

            <div className="flex justify-center flex-wrap gap-2">
              <SkillsCard2 skills={skills} limit={3} />
            </div>
          </div>
        )}

        {/* Footer */}
        {certificateUrlOrNumber && (
          <div className="text-center mt-4 border-t w-full border-gray-300 pt-4">
            <p className="glassy-text-secondary text-sm">
              Certificate ID:{" "}
              <span className="glassy-text-primary font-medium">
                {certificateUrlOrNumber}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInCertificate;
