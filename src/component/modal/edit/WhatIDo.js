import React from "react";
import Dialog from "@material-ui/core/Dialog";
import WhatIDoForm from "../../form/edit/WhatIDoForm";
import styles from "./modaledit.module.scss";

const WhatIDo = (props) => {
  return (
    <Dialog open={props.value} onClose={props.close}>
      <div className={`themeforest ${styles.root}`}>
        <h1>What I Do</h1>
        <WhatIDoForm
          isEdit={true}
          _id={props.data._id}
          icon={props.data.icon}
          title={props.data.title}
          description={props.data.description}
          reload={() => {
            props.close();
            props.reload();
          }}
        />
      </div>
    </Dialog>
  );
};

export default WhatIDo;
