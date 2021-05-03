import { useState } from "react";
import { useNavigate } from "react-router";
import { useFirebase } from "../../context/FirebaseProvider";
import { useRoomData } from "../../context/RoomDataProvider";
import styles from "./Requests.module.css";

const Requests = ({ state, user, toggleShowRequests }) => {
  const {
    room,
    members,
    messages,
    newMessage,
    currentUser,
    dispatch,
  } = useRoomData();

  const navigate = useNavigate();

  const { db } = useFirebase();

  const [closeRoom, setCloseRoom] = useState(false);

  const toggleCloseRoom = () => setCloseRoom((val) => !val);

  const membersExcludingCreator = members.filter(
    (member) => member.role !== "creator"
  );

  const requests = membersExcludingCreator.filter(
    (member) =>
      member.permissionStatus === "requested" && member.status === "active"
  );

  const speakers = membersExcludingCreator.filter(
    (member) =>
      member.permissionStatus === "granted" && member.status === "active"
  );

  const audience = membersExcludingCreator.filter(
    (member) => member.permissionStatus === "none" && member.status === "active"
  );

  return (
    <div>
      <div className={`${styles.header}`}>
        <div className={`container ${styles.headerContent}`}>
          <h1 className={`${styles.title}`}>{room?.title}</h1>
          {
            <button
              onClick={toggleShowRequests}
              className={`btn btn-ghost btn-icon btn-small`}
            >
              <img src="/icons/cancel.svg" alt="menu" />
            </button>
          }
        </div>
      </div>
      {requests.length !== 0 && (
        <div className={`container`}>
          <h2>Requests</h2>
          {requests.map((member) => (
            <RequestCard member={member} />
          ))}
        </div>
      )}
      {speakers.length !== 0 && (
        <div className={`container`}>
          <h2>Speakers</h2>
          {speakers.map((member) => (
            <RequestCard member={member} />
          ))}
        </div>
      )}
      {audience.length !== 0 && (
        <div className={`container`}>
          <h2>Audience</h2>
          {audience.map((member) => (
            <RequestCard member={member} />
          ))}
        </div>
      )}
      <div className="container">
        <br />
        <br />
        <button
          onClick={toggleCloseRoom}
          className={`btn btn-solid btn-small ${styles.closeRoomButton}`}
        >
          Close Room
        </button>
      </div>
      {closeRoom && (
        <>
          <div className="container">
            <p>Do you want to save room?</p>
            <div className="flex">
              <button
                onClick={() => {
                  db.collection("rooms").doc(room?.id).update({
                    visibility: "public",
                    status: "archieved",
                  });
                  toggleCloseRoom();
                  navigate("/history", { replace: true });
                }}
                className={`btn btn-solid btn-small ${styles.closeRoomButton}`}
              >
                Yes, Save
              </button>
              <button
                onClick={() => {
                  db.collection("rooms").doc(room?.id).update({
                    status: "archieved",
                  });
                  toggleCloseRoom();
                  navigate("/history", { replace: true });
                }}
                className={`btn btn-ghost btn-small ${styles.closeRoomButton}`}
              >
                No, Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const RequestCard = ({ member }) => {
  const { db, user } = useFirebase();
  const { room } = useRoomData();

  const { uid, name, role, permissionStatus } = member;

  const grantPermissionToMemberById = () => {
    db.collection("rooms").doc(room.id).collection("members").doc(uid).update({
      permissionStatus: "granted",
      role: "speaker",
    });
  };

  const revokePermissionToMemberById = () => {
    db.collection("rooms").doc(room.id).collection("members").doc(uid).update({
      permissionStatus: "none",
      role: "audience",
    });
  };

  return (
    <>
      {role !== "creator" ? (
        <div className={`${styles.requestCard}`}>
          <p className={`${styles.requestName}`}>{name}</p>
          {["granted", "requested"].includes(permissionStatus) &&
            room.creatorId === user.uid && (
              <button
                onClick={revokePermissionToMemberById}
                className={`btn btn-ghost btn-icon btn-small ${styles.requestActionButton}`}
              >
                <img src="/icons/cancel.svg" alt="cancel" />
              </button>
            )}
          {permissionStatus === "requested" && room.creatorId === user.uid && (
            <button
              onClick={grantPermissionToMemberById}
              className={`btn btn-ghost btn-icon btn-small ${styles.requestActionButton}`}
            >
              <img src="/icons/check.svg" alt="check" />
            </button>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Requests;
