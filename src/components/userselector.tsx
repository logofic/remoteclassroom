import * as React from "react";

import { Grid, Table, Checkbox, Button, Icon, Modal, Form, Header, Image, Input, Menu, Label } from "semantic-ui-react";

import { AddStudent } from "../components/addstudent";

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export interface UsersProps {
    users: RemoteUser[];
    selectedUser?: RemoteUser;
    messages: any[];
    onSelectedUser: (user: RemoteUser, isOnline: boolean) => void;
    presenceChannel: any;
}

export interface UsersState {
}

export class UserSelector extends React.Component<UsersProps, UsersState> {

    constructor(props: UsersProps) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        const { presenceChannel } = this.props;
        
        presenceChannel.bind("pusher:member_added", (member: any) => {
            this.forceUpdate();
        });

        presenceChannel.bind("pusher:member_removed", (member: any) => {
            this.forceUpdate();
        });
    }

    render() {
        const { users, messages, selectedUser, presenceChannel } = this.props;

        const getUnreadMessageCount = (user: RemoteUser) => {
            return messages.filter(message => (message.student == user.studentId && message.read == false)).length;
        }

        const presenceIndicator = (user: RemoteUser) => {
            return (presenceChannel.members.get(user.studentId)) ? "green" : "grey";
        }

        const isOnline = (user: RemoteUser) => {
            return (presenceChannel.members.get(user.studentId));
        }

        return <div className="user-selector">
            <Header inverted as="h3" className="actioned">Students 
                <AddStudent courseLink={`${session.protocol}://${session.host}/${session.launch_id}`} />
            </Header>
            <Menu vertical inverted fluid borderless className="user-selector">
                {users.map((user) =>
                    <Menu.Item active={user == selectedUser} onClick={() => this.props.onSelectedUser.call(this, user, isOnline(user))}>
                        {
                            getUnreadMessageCount(user) > 0 ?
                                <Label className="white">{getUnreadMessageCount(user)}</Label> : 
                                undefined
                        }
                        <Label circular color={presenceIndicator(user)} className="presense-label" empty />
                        <p>
                            {
                                user.avatarUrl ? 
                                    <Image spaced="right" avatar className="user-avatar" src={user.avatarUrl} /> :
                                    <div className="ui avatar right spaced image user-avatar no-user-avatar" style={{backgroundColor: user.color || "#512DA8"}}>{user.initials}</div>
                            } {user.fullName}
                        </p>
                    </Menu.Item>
                )}
            </Menu>
        </div>;
    }
}