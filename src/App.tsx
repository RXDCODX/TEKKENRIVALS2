const App: React.FC = () => {
  return (
    <>
      {/* Fixed logo in center of screen */}
      <div className='logo-container'>
        <img src='/logo.png' alt='TEKKEN RIVALS 2' className='logo' />
      </div>

      {/* Scroll container for creating long scroll */}
      <div className='scroll-container'>
        {/* Easter egg at the very bottom */}
        <div className='easter-egg'>
          <div className='easter-egg__content'>
            <div className='easter-egg__author'>
              <a
                href='https://twitch.tv/avicii75'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__link'
              >
                <img
                  src='/avicii75.webp'
                  alt='AVICII75'
                  className='easter-egg__avatar'
                />
                <span className='easter-egg__name'>twitch.tv/avicii75</span>
              </a>
            </div>

            <div className='easter-egg__author'>
              <a
                href='https://github.com/rxdcodx'
                target='_blank'
                rel='noopener noreferrer'
                className='easter-egg__link'
              >
                <img
                  src='https://avatars.githubusercontent.com/u/88150316'
                  alt='RXDCODX'
                  className='easter-egg__avatar'
                />
                <span className='easter-egg__name'>github.com/rxdcodx</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
