import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import PrismaZoom from 'react-prismazoom';
import { CenteredLayout } from '~/components';
import { calPos, generateId, IAnnotation, nameInitials } from '~/pages/annotations/utils';
import { addAnnotation, deleteAnnotation, getAnnotations } from '~/services/axios';
import deleteIcon from '../../assets/images/ic-delete.svg';
import sendIcon from '../../assets/images/ic-send.svg';
import mouseIcon from '../../assets/images/ic_mouse.svg';
import plusIcon from '../../assets/images/ic_plus.svg';
import css from './annotation.module.scss';

interface MarkerProps {
  id: number;
  x: number;
  y: number;
  children: JSX.Element;
}

interface CommentProps extends Omit<IAnnotation, 'comment'> {
  addAnnotation: (annotation: IAnnotation) => void;
}

interface AnnotationProps extends IAnnotation {
  removeAnnotation: (id: number) => void;
}

const Marker = ({ id, x, y, children }: MarkerProps) => {
  return (
    <div className={css.markerWrapper} style={{ top: calPos(y), left: calPos(x) }}>
      <div className={css.markerPoint}>{id}</div>
      <div className={css.speechBubble}>{children}</div>
    </div>
  );
};

const Comment = ({ id, author, pos, addAnnotation }: CommentProps) => {
  const [comment, setComment] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setComment(event.target.value);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    comment &&
      addAnnotation({
        id,
        author,
        comment,
        pos,
      });
  };

  return (
    <Marker id={id} x={pos.x} y={pos.y}>
      <form className={css.commentInput}>
        <input
          type={'text'}
          autoFocus={true}
          placeholder={'Leave a comment'}
          className={css.inputField}
          value={comment}
          onChange={handleChange}
        />
        <button className={css.inputButton} type={'submit'} onClick={handleSubmit}>
          <img src={sendIcon} alt={'ic-sent'} />
        </button>
      </form>
    </Marker>
  );
};

const Annotation = ({ id, author, comment, pos, removeAnnotation }: AnnotationProps) => {
  return (
    <Marker id={id} x={pos.x} y={pos.y}>
      <div className={css.annotation}>
        <div className={css.markerPoint}>{nameInitials(author)}</div>
        <div className={css.comment}>
          <p className={css.commentAuthor}>{author}</p>
          <p className={css.commentText}>{comment}</p>
        </div>
        <button className={css.inputButton} onClick={() => removeAnnotation(id)}>
          <img src={deleteIcon} alt={'ic-delete'} />
        </button>
      </div>
    </Marker>
  );
};

export const Annotations = () => {
  const [annotations, setAnnotations] = useState<IAnnotation[]>([]);
  const [marker, setMarker] = useState({ show: false, x: 0, y: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState({
    name: 'default.png',
    preview: '/src/assets/images/default.png',
  });

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileRef = event.target.files[0];
      fileRef.type.indexOf('image/') > -1 &&
        setImage({ name: fileRef.name, preview: URL.createObjectURL(fileRef) });
    }
  };

  const handleAddComment = (event: React.MouseEvent<HTMLImageElement>) => {
    const x = event.nativeEvent.offsetX / event.currentTarget.offsetWidth;
    const y = event.nativeEvent.offsetY / event.currentTarget.offsetHeight;

    setMarker({ show: true, x, y });
  };

  const handleAddAnnotation = (annotation: IAnnotation) => {
    setAnnotations((prevAnnotations) => [...prevAnnotations, annotation]);
    setMarker((prevMarker) => ({ ...prevMarker, show: false }));
    addAnnotation(annotation);
  };

  const handleDeleteAnnotation = (id: number) => {
    setAnnotations((prevAnnotations) =>
      prevAnnotations.filter((annotation) => annotation.id !== id),
    );
    deleteAnnotation(id);
  };

  useEffect(() => {
    const fetchAnnotation = async () => {
      const annotations = await getAnnotations();
      annotations && setAnnotations(annotations);
    };

    fetchAnnotation();
    setModalOpen(true);
  }, []);

  return (
    <CenteredLayout className={'bg-black'}>
      <div className={css.container}>
        <div className={css.upload}>
          <p className={css.uploadText}>{image.name}</p>
          <label className={css.uploadButton}>
            <input className={css.defaultInput} type={'file'} onChange={handleFileInputChange} />
            Upload image
          </label>
        </div>

        <div className={css.imgContainer}>
          <PrismaZoom>
            <img src={image.preview} alt={'image'} onClick={handleAddComment} />
            {annotations &&
              annotations.map((annotation) => (
                <Annotation
                  key={annotation.id}
                  id={annotation.id}
                  author={annotation.author}
                  comment={annotation.comment}
                  pos={{ x: annotation.pos.x, y: annotation.pos.y }}
                  removeAnnotation={handleDeleteAnnotation}
                />
              ))}
            {marker.show && (
              <Comment
                id={generateId(annotations)}
                author={author}
                pos={{ x: marker.x, y: marker.y }}
                addAnnotation={handleAddAnnotation}
              />
            )}
          </PrismaZoom>
        </div>

        <div className={css.instruction}>
          <p className={css.instructionText}>To leave a comment, mouseover</p>
          <img src={plusIcon} alt={'ic-plus'} />
          <p className={css.instructionText}>on an image and click the left mouse button</p>
          <img src={mouseIcon} alt={'ic-mouse'} />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        className={css.modal}
        overlayClassName={css.overlay}
        ariaHideApp={false}
      >
        <form className={css.commentInput}>
          <input
            type={'text'}
            placeholder={'Enter your name'}
            autoFocus={true}
            className={css.inputField}
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
          <button
            className={css.inputButton}
            type={'submit'}
            onClick={(event) => {
              event.preventDefault();
              author && setModalOpen(false);
            }}
          >
            <img src={sendIcon} alt={'ic-sent'} />
          </button>
        </form>
      </Modal>
    </CenteredLayout>
  );
};
