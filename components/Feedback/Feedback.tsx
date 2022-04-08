import React, { useState } from "react";
import { Modal, TextareaInput } from "..";
import useUtilsHooks from "../../graphql/hooks/utils";

import { FiMail, FiSend } from "react-icons/fi";

const Feedback: React.FC = () => {
  const [show, setShow] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { addFeedback, addClickMetric } = useUtilsHooks();
  // retrieve the text from messageRef

  const onFeedbackClick = () => {
    setShow(true);
    addClickMetric("feedback button");
  };

  const onSubmit = () => {
    setMessage("");
    setSubmitted(true);
    addFeedback(message, followUp ? email || null : null);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setSubmitted(false);
    }, 100);
  };

  return (
    <div>
      <Modal show={show} close={handleClose}>
        {submitted ? (
          <>
            <Modal.Header close={handleClose}>
              <div className="feedback-header">
                Feedback submitted. Thanks for your input!
              </div>
            </Modal.Header>
            <Modal.Footer>
              <div className="f-row f-center">
                <button
                  className="btn  btn-secondary-outline"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header close={handleClose}>
              <div className="feedback-header">
                Got feedback on Kuoly? We'd love to hear it.
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="feedback-body">
                <label htmlFor="feedback" className="feedback-label">
                  Any thoughts to share?
                </label>
                <div className="textarea-wrapper">
                  <TextareaInput
                    isEditing={true}
                    handleSubmit={(val, key) => setMessage(val)}
                    fieldEditingProp={{
                      typename: "None",
                      key: "feedback",
                      id: "0",
                    }}
                    placeholder="Send feedback..."
                    value={message || ""}
                    className="textarea"
                  />
                </div>
                <div className="input-container-row">
                  <input
                    id="feeback-checkbox"
                    type="checkbox"
                    checked={followUp}
                    onChange={(e) => setFollowUp(e.target.checked)}
                  />
                  <label htmlFor="checkbox feeback-checkbox">
                    May we follow up with you?
                  </label>
                </div>
                {followUp && (
                  <div className="input-icon-container">
                    <label htmlFor="email">
                      <FiMail className="icon" />
                    </label>
                    <input
                      className="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      id="email"
                      placeholder="Enter email"
                    />
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="g-row footer">
                <button
                  className="btn  btn-secondary-outline"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button className="btn btn-secondary" onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
      <button className="btn-icon btn-white" onClick={onFeedbackClick}>
        <FiSend />
        <div>Send Feedback</div>
      </button>
    </div>
  );
};

export default Feedback;
