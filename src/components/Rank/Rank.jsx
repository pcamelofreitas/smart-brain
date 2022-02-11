const Rank =({userName, userEntries}) =>{
    return(
        <div>
            <div className="white f3">
                {`${userName} your current Rank is ...`}
            </div>
            <div className="white f1">
                {userEntries}
            </div>
        </div>
    )
}

export default Rank;
