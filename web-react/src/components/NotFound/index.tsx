import Die from './nat 1.jpg';

function NotFoundPage() {
    return (
        <div>
            <h1>Skill check failed...</h1>
            <img src={Die} alt='20-sided die roll result of 1'/>
            <p>The dungeon you were looking for could not be found :(</p>
        </div>
    )
}

export default NotFoundPage;