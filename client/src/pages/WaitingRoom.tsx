/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { MdContentCopy, MdPeopleOutline } from 'react-icons/md';
import { useCopyToClipboard } from 'react-use';
import { useSnapshot } from 'valtio';
import NominationForm from '../components/NominationForm';
import ParticipantList from '../components/ParticipantList';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { actions, state } from '../states';
import { colorizeText } from '../util';

const WaitingRoom = () => {
  const currentState = useSnapshot(state);
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);

  const [isNorminationformOpen, setIsNorminationFormOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [participantToRemove, setParticipantToRemove] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    actions.initializedSocket();
  }, []);

  const confirmRemoveParticipant = (id: string): void => {
    setConfirmationMessage(
      `Remove ${currentState.poll?.participants[id]} from poll?`,
    );
    setParticipantToRemove(id);
    setIsConfirmationOpen(true);
  };

  const handleRemoveParticipant = () => {
    participantToRemove && actions.removeParticipant(participantToRemove);
    setIsConfirmationOpen(false);
  };

  return (
    <div className="flex flex-col w-full justify-between items-center h-full">
      <section className="flex flex-col items-center justify-center">
        <h1 className="font-bold mb-3">Lobby 🚀</h1>
        <p className="italic text-center underline mb-4">
          <strong>Topic: </strong>
          {currentState.poll?.topic}
        </p>
        <div
          onClick={() => {
            copyToClipboard(currentState.poll?.id || '');
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
          className="mb-4 flex justify-center align-middle cursor-pointer"
        >
          <div className="font-extrabold text-center mr-2">
            {currentState.poll && colorizeText(currentState.poll.id)}
          </div>
          <div className="flex items-center gap-2">
            <MdContentCopy className="hover:fill-slate-700" size={24} />
            {copied ? (
              <span className="text-sm font-semibold text-slate-600">
                Copied!
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <button
          className="box btn-orange mx-2 pulsate"
          onClick={() => setIsParticipantListOpen(true)}
        >
          <MdPeopleOutline size={24} />
          <span>{currentState.participantCount}</span>
        </button>
        <button
          className="box btn-purple mx-2 pulsate"
          onClick={() => setIsNorminationFormOpen(true)}
        >
          <BsPencilSquare size={24} />
          <span>{currentState.norminationCount}</span>
        </button>
      </section>

      <section className="flex flex-col justify-center">
        {currentState.isAdmin ? (
          <>
            <div className="my-2 italic font-semibold">
              {currentState.poll?.votesPerVoter} Nominations Required to Start!
            </div>
            <button
              className="box btn-orange my-2"
              disabled={!currentState.canStartVote}
              onClick={() => console.log(`will add start vote next time`)}
            >
              Start voting
            </button>

            <ConfirmationDialog
              showDialog={isConfirmationOpen}
              message={confirmationMessage}
              onConfirm={() => handleRemoveParticipant()}
              onCancel={() => setIsConfirmationOpen(false)}
            />
          </>
        ) : (
          <div className="my-2 italic">
            Waiting for Admin,&nbsp;
            <span className="font-semibold">
              {currentState.poll?.participants[currentState.poll.adminID]}
            </span>
            &nbsp;to start voting
          </div>
        )}
        <button
          className="box btn-purple my-2"
          onClick={() => setShowConfirmation(true)}
        >
          Leave poll
        </button>
        <ConfirmationDialog
          message="You willl be kicked out of the poll"
          showDialog={showConfirmation}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => actions.startOver()}
        />
      </section>
      <ParticipantList
        isOpen={isParticipantListOpen}
        onClose={() => setIsParticipantListOpen(false)}
        participants={currentState.poll?.participants}
        onRemoveParticipant={confirmRemoveParticipant}
        isAdmin={currentState.isAdmin || false}
        userID={currentState.me?.id}
      />
      <NominationForm
        title={currentState.poll?.topic}
        isOpen={isNorminationformOpen}
        onClose={() => setIsNorminationFormOpen(false)}
        onSubmitNomination={(nominationText) =>
          actions.norminate(nominationText)
        }
        nominations={currentState.poll?.norminations}
        userID={currentState.me?.id}
        onRemoveNomination={(nominationID) =>
          actions.removeNormination(nominationID)
        }
        isAdmin={currentState.isAdmin || false}
      />
    </div>
  );
};

export default WaitingRoom;
