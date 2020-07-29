import React from 'react';

class Profile extends React.Component {
    render() {
        return (
            <div>
                <h2>Profile print {this.props.name}, {this.props.age}</h2>
                <p>{this.props.children}</p>
            </div>
        );
    }
};

export default Profile;