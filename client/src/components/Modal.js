function Modal({ autoplay, toggleAutoplay, isModalVisible, closeModal }) {
    if (isModalVisible === false) return null;
    return (
      <div className="bg-progGrey rounded-full p-2 shadow-md flex flex-col items-center justify-center absolute z-50 top-16 left-2">
        <ul className="list-none">
          <svg
            className="mb-4"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            onClick={closeModal}
          >
            <path
              fill="#FFFFFF"
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            ></path>
          </svg>
          {autoplay ? (
            <svg
              className="mb-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              onClick={toggleAutoplay}
            >
              <path
                fill="#FFFFFF"
                d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7 2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
              ></path>
            </svg>
          ) : (
            <svg
              className="mb-4"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              onClick={toggleAutoplay}
            >
              <path
                fill="#999999"
                d="M10 6.35V4.26c-.8.21-1.55.54-2.23.96l1.46 1.46c.25-.12.5-.24.77-.33zm-7.14-.94 2.36 2.36C4.45 8.99 4 10.44 4 12c0 2.21.91 4.2 2.36 5.64L4 20h6v-6l-2.24 2.24C6.68 15.15 6 13.66 6 12c0-1 .25-1.94.68-2.77l8.08 8.08c-.25.13-.5.25-.77.34v2.09c.8-.21 1.55-.54 2.23-.96l2.36 2.36 1.27-1.27L4.14 4.14 2.86 5.41zM20 4h-6v6l2.24-2.24C17.32 8.85 18 10.34 18 12c0 1-.25 1.94-.68 2.77l1.46 1.46C19.55 15.01 20 13.56 20 12c0-2.21-.91-4.2-2.36-5.64L20 4z"
              ></path>
            </svg>
          )}
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#999999"
              d="M7 9H2V7h5v2zm0 3H2v2h5v-2zm13.59 7-3.83-3.83c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L22 17.59 20.59 19zM17 11c0-1.65-1.35-3-3-3s-3 1.35-3 3 1.35 3 3 3 3-1.35 3-3zM2 19h10v-2H2v2z"
            ></path>
          </svg>
        </ul>
      </div>
    );
  }
  export default Modal;
  