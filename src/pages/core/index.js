import React from "react";
import {Typography , Button} from "antd";
const { Title, Paragraph, Text, Link } = Typography;

class Core extends React.PureComponent {
  constructor(props) {
    super(props);
    let {turnTo} = props;
  }
  render() {
    return (
      <div>
        <Text>Welcome to the Core Page</Text>
        <Button type="primary" onClick={() => this.props.turnTo('/')}>Go to Welcome</Button>
      </div>
    );
  }
}

export default Core;