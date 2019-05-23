import classNames from "classnames";
import React from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";

import styles from "./DemoCard.module.css";

interface IProps extends RouteComponentProps {
    demo: IDemoCard;
}

const DemoCard: React.FC<IProps> = ({demo, history}) => {
    return (
        <div className={styles.container}
            onClick={() => history.push(`demo/${demo.id}`)}>
            <div className={styles.header}>
                <div className={styles.name}>{demo.name}</div>
                <div className={classNames("material-icons", styles.icon)}>{demo.icon}</div>
            </div>
            <div className={styles.description}>{demo.description}</div>
        </div>
    );
};

export default withRouter<IProps>(DemoCard);
